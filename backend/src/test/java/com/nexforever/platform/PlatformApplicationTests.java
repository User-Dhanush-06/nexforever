package com.nexforever.platform;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class PlatformApplicationTests {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private Flyway flyway;

	@Test
	void contextLoads() {
		assertThat(dataSource).isNotNull();
		assertThat(flyway).isNotNull();
	}

	@Test
	void mysqlConnectionAndFlywayBaselineExecuted() throws Exception {
		try (Connection connection = dataSource.getConnection()) {
			assertThat(connection.isValid(2)).isTrue();
		}

		String activeDb = jdbcTemplate.queryForObject("SELECT DATABASE()", String.class);
		assertThat(activeDb).isEqualTo("nexforever_db");

		Integer ping = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
		assertThat(ping).isEqualTo(1);

		MigrationInfo[] applied = flyway.info().applied();
		assertThat(applied).isNotEmpty();
		assertThat(applied)
				.anySatisfy(info -> {
					assertThat(info.getVersion().getVersion()).isEqualTo("1");
					assertThat(info.getScript()).contains("V1__initial_baseline.sql");
				});

		Integer historySuccess = jdbcTemplate.queryForObject(
				"SELECT success FROM flyway_schema_history WHERE version = '1'",
				Integer.class
		);
		assertThat(historySuccess).isEqualTo(1);
	}

}
