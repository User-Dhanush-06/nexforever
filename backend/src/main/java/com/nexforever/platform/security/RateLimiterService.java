package com.nexforever.platform.security;

import com.nexforever.platform.exception.RateLimitExceededException;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class RateLimiterService {

    private static final int MAX_TRACKED_KEYS = 5000;
    private final Map<String, Deque<Instant>> requestWindows = new ConcurrentHashMap<>();

    public void checkLimit(String scope, String key, int maxRequests, Duration window, String message) {
        String compositeKey = scope + ":" + (key != null ? key : "unknown");
        Instant now = Instant.now();
        Instant cutoff = now.minus(window);

        if (requestWindows.size() > MAX_TRACKED_KEYS) {
            pruneExpired(now.minus(Duration.ofMinutes(30)));
        }

        Deque<Instant> timestamps = requestWindows.computeIfAbsent(compositeKey, k -> new ArrayDeque<>());
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(cutoff)) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= maxRequests) {
                throw new RateLimitExceededException(message);
            }
            timestamps.addLast(now);
        }
    }

    public void clearScope(String scope) {
        String prefix = scope + ":";
        requestWindows.keySet().removeIf(k -> k.startsWith(prefix));
    }

    private void pruneExpired(Instant staleCutoff) {
        requestWindows.entrySet().removeIf(entry -> {
            Deque<Instant> deque = entry.getValue();
            synchronized (deque) {
                while (!deque.isEmpty() && deque.peekFirst().isBefore(staleCutoff)) {
                    deque.pollFirst();
                }
                return deque.isEmpty();
            }
        });
    }
}

