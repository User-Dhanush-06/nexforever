import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquareQuote,
  Briefcase,
  Layers,
  Star,
  HelpCircle,
  Image as ImageIcon,
  Settings as SettingsIcon,
  LogOut,
  Globe,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Upload,
  Copy,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Eye,
} from 'lucide-react';
import {
  fetchAdminDashboard,
  fetchAdminProjects,
  createAdminProject,
  updateAdminProject,
  updateAdminProjectStatus,
  deleteAdminProject,
  fetchAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  fetchAdminTestimonials,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
  fetchAdminFaqs,
  createAdminFaq,
  updateAdminFaq,
  deleteAdminFaq,
  fetchAdminEnquiries,
  updateAdminEnquiry,
  deleteAdminEnquiry,
  fetchAdminMedia,
  uploadAdminMedia,
  deleteAdminMedia,
  fetchAdminSettings,
  updateAdminSettings,
  adminLogout,
} from '../services/apiClient';

const CATEGORIES = [
  'Web Development',
  'Video Production',
  'Creative Design',
  'Digital Marketing',
];

export default function AdminDashboardPage({ admin, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {
      // Ignore logout errors
    } finally {
      if (onLogout) onLogout();
      if (onNavigate) onNavigate('/admin/login');
    }
  };

  return (
    <div className="admin-layout">
      {/* Admin Top Navbar */}
      <header className="admin-header">
        <div className="admin-header__brand">
          <span className="admin-header__dot" aria-hidden="true" />
          <div>
            <h1 className="admin-header__title">NexForever Studio CMS</h1>
            <span className="admin-header__sub">Platform Management</span>
          </div>
        </div>

        <div className="admin-header__user">
          <span className="admin-user-pill">
            <span className="admin-user-dot" aria-hidden="true" />
            <span className="admin-user-email">{admin?.email || 'admin@nexforever.studio'}</span>
          </span>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('/');
            }}
            className="admin-link-btn"
            title="View Live Website"
          >
            <Globe size={15} aria-hidden="true" />
            <span>View Site</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-link-btn admin-link-btn--danger"
            title="Sign Out"
          >
            <LogOut size={15} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Body */}
      <div className="admin-body">
        {/* Navigation Sidebar */}
        <aside className="admin-sidebar" aria-label="Admin Navigation">
          <nav className="admin-nav" role="tablist">
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'overview' ? 'admin-nav-item--active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={17} aria-hidden="true" />
              <span>Overview</span>
            </button>
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'enquiries' ? 'admin-nav-item--active' : ''}`}
              onClick={() => setActiveTab('enquiries')}
            >
              <MessageSquareQuote size={17} aria-hidden="true" />
              <span>Inquiries</span>
            </button>
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'projects' ? 'admin-nav-item--active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <Briefcase size={17} aria-hidden="true" />
              <span>Projects</span>
            </button>
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'services' ? 'admin-nav-item--active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              <Layers size={17} aria-hidden="true" />
              <span>Services</span>
            </button>
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'testimonials' ? 'admin-nav-item--active' : ''}`}
              onClick={() => setActiveTab('testimonials')}
            >
              <Star size={17} aria-hidden="true" />
              <span>Testimonials</span>
            </button>
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'faqs' ? 'admin-nav-item--active' : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              <HelpCircle size={17} aria-hidden="true" />
              <span>FAQs</span>
            </button>
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'media' ? 'admin-nav-item--active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              <ImageIcon size={17} aria-hidden="true" />
              <span>Media</span>
            </button>
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'settings' ? 'admin-nav-item--active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <SettingsIcon size={17} aria-hidden="true" />
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Workspace Area */}
        <main className="admin-content" role="region" aria-label="CMS Workspace">
          {notification && (
            <div className={`admin-toast admin-toast--${notification.type}`} role="status">
              {notification.type === 'success' ? (
                <CheckCircle size={16} aria-hidden="true" />
              ) : (
                <AlertCircle size={16} aria-hidden="true" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <OverviewTab onSwitchTab={setActiveTab} onNotify={showNotification} />
          )}
          {activeTab === 'enquiries' && <EnquiriesTab onNotify={showNotification} />}
          {activeTab === 'projects' && <ProjectsTab onNotify={showNotification} />}
          {activeTab === 'services' && <ServicesTab onNotify={showNotification} />}
          {activeTab === 'testimonials' && <TestimonialsTab onNotify={showNotification} />}
          {activeTab === 'faqs' && <FaqsTab onNotify={showNotification} />}
          {activeTab === 'media' && <MediaTab onNotify={showNotification} />}
          {activeTab === 'settings' && <SettingsTab onNotify={showNotification} />}
        </main>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* TAB: OVERVIEW                                                             */
/* ========================================================================= */
function OverviewTab({ onSwitchTab, onNotify }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminDashboard();
      setData(res);
    } catch (err) {
      onNotify('error', err?.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading studio metrics...</div>;
  }

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2 className="admin-section__title">Studio Overview</h2>
          <p className="admin-section__sub">Platform summary, client inquiries and content readiness.</p>
        </div>
        <button type="button" className="admin-btn admin-btn--glass" onClick={load}>
          <RefreshCw size={14} aria-hidden="true" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card" onClick={() => onSwitchTab('enquiries')}>
          <span className="admin-stat-label">Inquiries</span>
          <div className="admin-stat-val">{data?.totalEnquiries ?? 0}</div>
          <span className="admin-stat-meta accent-mint">{data?.newEnquiries ?? 0} new waiting</span>
        </div>

        <div className="admin-stat-card" onClick={() => onSwitchTab('projects')}>
          <span className="admin-stat-label">Projects</span>
          <div className="admin-stat-val">{data?.totalProjects ?? 0}</div>
          <span className="admin-stat-meta">{data?.publishedProjects ?? 0} published live</span>
        </div>

        <div className="admin-stat-card" onClick={() => onSwitchTab('services')}>
          <span className="admin-stat-label">Services</span>
          <div className="admin-stat-val">{data?.totalServices ?? 0}</div>
          <span className="admin-stat-meta">{data?.publishedServices ?? 0} published</span>
        </div>

        <div className="admin-stat-card" onClick={() => onSwitchTab('testimonials')}>
          <span className="admin-stat-label">Testimonials</span>
          <div className="admin-stat-val">{data?.totalTestimonials ?? 0}</div>
          <span className="admin-stat-meta">{data?.publishedTestimonials ?? 0} approved</span>
        </div>

        <div className="admin-stat-card" onClick={() => onSwitchTab('faqs')}>
          <span className="admin-stat-label">FAQs</span>
          <div className="admin-stat-val">{data?.totalFaqs ?? 0}</div>
          <span className="admin-stat-meta">{data?.publishedFaqs ?? 0} published</span>
        </div>

        <div className="admin-stat-card" onClick={() => onSwitchTab('media')}>
          <span className="admin-stat-label">Media Assets</span>
          <div className="admin-stat-val">{data?.totalMediaAssets ?? 0}</div>
          <span className="admin-stat-meta">Uploaded files</span>
        </div>
      </div>

      {/* Recent Inquiries Quick Table */}
      <div className="admin-card">
        <div className="admin-card__head">
          <h3 className="admin-card__title">Recent Client Inquiries</h3>
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--glass"
            onClick={() => onSwitchTab('enquiries')}
          >
            <span>View All</span>
          </button>
        </div>

        {Array.isArray(data?.recentEnquiries) && data.recentEnquiries.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentEnquiries.map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <code className="admin-code">{enq.referenceCode}</code>
                    </td>
                    <td>{enq.name}</td>
                    <td>{enq.email}</td>
                    <td>{enq.serviceInterest || 'General'}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${enq.status.toLowerCase()}`}>
                        {enq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty">No client inquiries received yet.</p>
        )}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* TAB: ENQUIRIES                                                            */
/* ========================================================================= */
function EnquiriesTab({ onNotify }) {
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [editStatus, setEditStatus] = useState('NEW');
  const [internalNotes, setInternalNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminEnquiries({ status: filter });
      setEnquiries(res);
    } catch (err) {
      onNotify('error', err?.message || 'Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const openDetails = (enq) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setInternalNotes(enq.internalNotes || '');
  };

  const handleUpdate = async () => {
    if (!selectedEnquiry) return;
    try {
      setSaving(true);
      const updated = await updateAdminEnquiry(selectedEnquiry.id, {
        status: editStatus,
        internalNotes,
      });
      onNotify('success', `Inquiry ${updated.referenceCode} updated.`);
      setSelectedEnquiry(null);
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to update inquiry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, refCode) => {
    if (!window.confirm(`Delete inquiry ${refCode}?`)) return;
    try {
      await deleteAdminEnquiry(id);
      onNotify('success', `Inquiry ${refCode} deleted.`);
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to delete inquiry.');
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2 className="admin-section__title">Client Inquiries</h2>
          <p className="admin-section__sub">Manage leads from the Project Inquiry Wizard.</p>
        </div>

        <div className="admin-filters">
          {['', 'NEW', 'REVIEWING', 'CONTACTED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              type="button"
              className={`admin-filter-pill ${filter === st ? 'admin-filter-pill--active' : ''}`}
              onClick={() => setFilter(st)}
            >
              {st || 'All'}
            </button>
          ))}
          <button type="button" className="admin-btn admin-btn--glass" onClick={load}>
            <RefreshCw size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading inquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="admin-card admin-empty">No inquiries matching filter.</div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Package</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <code className="admin-code">{enq.referenceCode}</code>
                    </td>
                    <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                    <td>{enq.name}</td>
                    <td>
                      <a href={`mailto:${enq.email}`} className="admin-link">
                        {enq.email}
                      </a>
                    </td>
                    <td>{enq.serviceInterest || 'General'}</td>
                    <td>{enq.packageName || 'Custom'}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${enq.status.toLowerCase()}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="View Details"
                          onClick={() => openDetails(enq)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          title="Delete"
                          onClick={() => handleDelete(enq.id, enq.referenceCode)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedEnquiry(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <div>
                <span className="admin-modal__eyebrow">Client Inquiry</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
                  <h3 className="admin-modal__title">{selectedEnquiry.referenceCode}</h3>
                  <span className={`admin-badge admin-badge--${selectedEnquiry.status.toLowerCase()}`}>
                    Current: {selectedEnquiry.status}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => setSelectedEnquiry(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal__body">
              <div className="admin-detail-grid">
                <div>
                  <span className="admin-detail-label">Client Name</span>
                  <span className="admin-detail-val">{selectedEnquiry.name}</span>
                </div>
                <div>
                  <span className="admin-detail-label">Email</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="admin-link">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="admin-detail-label">Audience Profile</span>
                  <span className="admin-detail-val">{selectedEnquiry.audienceProfile}</span>
                </div>
                <div>
                  <span className="admin-detail-label">Package Framework</span>
                  <span className="admin-detail-val">{selectedEnquiry.packageName}</span>
                </div>
                <div>
                  <span className="admin-detail-label">Service Interest</span>
                  <span className="admin-detail-val">{selectedEnquiry.serviceInterest}</span>
                </div>
                <div>
                  <span className="admin-detail-label">Budget Scope</span>
                  <span className="admin-detail-val">{selectedEnquiry.budgetScope}</span>
                </div>
                <div>
                  <span className="admin-detail-label">Planning Preference</span>
                  <span className="admin-detail-val">{selectedEnquiry.planningPreference}</span>
                </div>
                <div>
                  <span className="admin-detail-label">Received At</span>
                  <span className="admin-detail-val">
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="admin-detail-block">
                <span className="admin-detail-label">Project Message</span>
                <p className="admin-detail-text">{selectedEnquiry.message}</p>
              </div>

              <div className="admin-detail-form">
                <div className="admin-form-group">
                  <label className="admin-form-label">Inquiry Status</label>
                  <select
                    className="admin-input admin-select"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="NEW">NEW</option>
                    <option value="REVIEWING">REVIEWING</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Internal Studio Notes</label>
                  <textarea
                    className="admin-input"
                    rows={3}
                    placeholder="Add studio review notes..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="admin-modal__foot">
              <button
                type="button"
                className="admin-btn admin-btn--glass"
                onClick={() => setSelectedEnquiry(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Update Inquiry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* TAB: PROJECTS                                                             */
/* ========================================================================= */
function ProjectsTab({ onNotify }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    slug: '',
    title: '',
    category: 'Web Development',
    clientName: '',
    shortDescription: '',
    overview: '',
    challenges: '',
    solutions: '',
    results: '',
    technologies: '',
    coverImage: '',
    liveUrl: '',
    sourceUrl: '',
    status: 'PUBLISHED',
    featured: false,
    displayOrder: 0,
    media: [],
  };

  const [formData, setFormData] = useState(initialForm);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminProjects();
      setProjects(res);
    } catch (err) {
      onNotify('error', err?.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setIsNew(true);
    setFormData(initialForm);
    setEditingProject({ id: 'new' });
  };

  const openEdit = (proj) => {
    setIsNew(false);
    setEditingProject(proj);
    setFormData({
      slug: proj.slug || '',
      title: proj.title || '',
      category: proj.category || 'Web Development',
      clientName: proj.clientName || '',
      shortDescription: proj.shortDescription || '',
      overview: proj.overview || '',
      challenges: proj.challenges || '',
      solutions: proj.solutions || '',
      results: Array.isArray(proj.results) ? proj.results.join('\n') : '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
      coverImage: proj.coverImage || '',
      liveUrl: proj.liveUrl || '',
      sourceUrl: proj.sourceUrl || '',
      status: proj.status || 'DRAFT',
      featured: Boolean(proj.featured),
      displayOrder: proj.displayOrder ?? 0,
      media: Array.isArray(proj.media) ? proj.media : [],
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      onNotify('error', 'Title and Slug are required.');
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      slug: formData.slug.trim().toLowerCase(),
      results: formData.results
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      technologies: formData.technologies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      setSaving(true);
      if (isNew) {
        await createAdminProject(payload);
        onNotify('success', 'Project created successfully.');
      } else {
        await updateAdminProject(editingProject.id, payload);
        onNotify('success', 'Project updated successfully.');
      }
      setEditingProject(null);
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (proj) => {
    const nextStatus = proj.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await updateAdminProjectStatus(proj.id, nextStatus);
      onNotify('success', `Project ${proj.title} marked ${nextStatus}.`);
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to update project status.');
    }
  };

  const handleDelete = async (proj) => {
    if (!window.confirm(`Delete project "${proj.title}"?`)) return;
    try {
      await deleteAdminProject(proj.id);
      onNotify('success', `Project "${proj.title}" deleted.`);
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to delete project.');
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2 className="admin-section__title">Portfolio Projects</h2>
          <p className="admin-section__sub">Manage published case studies and interactive modal details.</p>
        </div>

        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn--glass" onClick={load}>
            <RefreshCw size={14} aria-hidden="true" />
          </button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={openNew}>
            <Plus size={15} aria-hidden="true" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="admin-card admin-empty">
          <p>No projects in database. Click &ldquo;New Project&rdquo; to publish your first case study.</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id}>
                    <td>{proj.displayOrder}</td>
                    <td>
                      <strong>{proj.title}</strong>
                      <span className="admin-subtext">/{proj.slug}</span>
                    </td>
                    <td>{proj.category}</td>
                    <td>
                      <button
                        type="button"
                        className={`admin-badge admin-badge--btn admin-badge--${proj.status.toLowerCase()}`}
                        onClick={() => handleToggleStatus(proj)}
                        title="Click to toggle status"
                      >
                        {proj.status}
                      </button>
                    </td>
                    <td>{proj.featured ? <span className="accent-mint">Yes</span> : 'No'}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Edit"
                          onClick={() => openEdit(proj)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          title="Delete"
                          onClick={() => handleDelete(proj)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Edit / Create Modal */}
      {editingProject && (
        <div className="admin-modal-backdrop" onClick={() => setEditingProject(null)}>
          <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <div>
                <span className="admin-modal__eyebrow">{isNew ? 'New Entry' : 'Edit Project'}</span>
                <h3 className="admin-modal__title">{formData.title || 'Untitled Project'}</h3>
              </div>
              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => setEditingProject(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal__body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Project Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.title}
                    onChange={(e) => {
                      const t = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        title: t,
                        slug: isNew ? t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : p.slug,
                      }));
                    }}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Slug *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Category</label>
                  <select
                    className="admin-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Client Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Short Description (Card Teaser)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Case Study Overview</label>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Challenges</label>
                  <textarea
                    className="admin-input"
                    rows={2}
                    value={formData.challenges}
                    onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Solutions</label>
                  <textarea
                    className="admin-input"
                    rows={2}
                    value={formData.solutions}
                    onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Results (One bullet per line)</label>
                  <textarea
                    className="admin-input"
                    rows={3}
                    placeholder="250% increase in lead conversion&#10;Sub-second load times"
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Technologies (Comma-separated)</label>
                  <textarea
                    className="admin-input"
                    rows={3}
                    placeholder="React, Three.js, GSAP, Spring Boot"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Cover Image URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="https://... or /api/media/files/..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Live URL (Optional)</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Publication Status</label>
                  <select
                    className="admin-input"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="admin-modal__foot">
                <button
                  type="button"
                  className="admin-btn admin-btn--glass"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : isNew ? 'Create Project' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* TAB: SERVICES                                                             */
/* ========================================================================= */
function ServicesTab({ onNotify }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    serviceNumber: '05',
    slug: '',
    title: '',
    tag: '',
    description: '',
    details: '',
    items: '',
    icon: 'Code2',
    published: true,
    displayOrder: 5,
  };

  const [formData, setFormData] = useState(initialForm);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminServices();
      setServices(res);
    } catch (err) {
      onNotify('error', err?.message || 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setIsNew(true);
    setFormData(initialForm);
    setEditingService({ id: 'new' });
  };

  const openEdit = (svc) => {
    setIsNew(false);
    setEditingService(svc);
    setFormData({
      serviceNumber: svc.serviceNumber || '',
      slug: svc.slug || '',
      title: svc.title || '',
      tag: svc.tag || '',
      description: svc.description || '',
      details: svc.details || '',
      items: Array.isArray(svc.items) ? svc.items.join('\n') : '',
      icon: svc.icon || 'Code2',
      published: Boolean(svc.published),
      displayOrder: svc.displayOrder ?? 0,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      items: formData.items
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      setSaving(true);
      if (isNew) {
        await createAdminService(payload);
        onNotify('success', 'Service created successfully.');
      } else {
        await updateAdminService(editingService.id, payload);
        onNotify('success', 'Service updated successfully.');
      }
      setEditingService(null);
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (svc) => {
    if (!window.confirm(`Delete service "${svc.title}"?`)) return;
    try {
      await deleteAdminService(svc.id);
      onNotify('success', `Service "${svc.title}" deleted.`);
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to delete service.');
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2 className="admin-section__title">Studio Services</h2>
          <p className="admin-section__sub">Manage studio capability cards, descriptions and deliverables.</p>
        </div>

        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn--glass" onClick={load}>
            <RefreshCw size={14} aria-hidden="true" />
          </button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={openNew}>
            <Plus size={15} aria-hidden="true" />
            <span>New Service</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading services...</div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Title</th>
                  <th>Tag</th>
                  <th>Icon</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc) => (
                  <tr key={svc.id}>
                    <td>
                      <code className="admin-code">{svc.serviceNumber}</code>
                    </td>
                    <td>
                      <strong>{svc.title}</strong>
                    </td>
                    <td>{svc.tag}</td>
                    <td>{svc.icon}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${svc.published ? 'published' : 'draft'}`}>
                        {svc.published ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Edit"
                          onClick={() => openEdit(svc)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          title="Delete"
                          onClick={() => handleDelete(svc)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {editingService && (
        <div className="admin-modal-backdrop" onClick={() => setEditingService(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <div>
                <span className="admin-modal__eyebrow">{isNew ? 'New Service' : 'Edit Service'}</span>
                <h3 className="admin-modal__title">{formData.title || 'Untitled Service'}</h3>
              </div>
              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => setEditingService(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal__body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Service Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.serviceNumber}
                    onChange={(e) => setFormData({ ...formData, serviceNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Slug</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Tag</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Description</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Details (Expandable Approach)</label>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Deliverables (One item per line)</label>
                <textarea
                  className="admin-input"
                  rows={4}
                  value={formData.items}
                  onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Icon (Code2, Video, Palette, TrendingUp)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="admin-modal__foot">
                <button
                  type="button"
                  className="admin-btn admin-btn--glass"
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* TAB: TESTIMONIALS                                                         */
/* ========================================================================= */
function TestimonialsTab({ onNotify }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    authorName: '',
    authorRole: '',
    companyOrChannel: '',
    quote: '',
    category: 'General',
    approved: true,
    published: true,
    displayOrder: 0,
  };

  const [formData, setFormData] = useState(initialForm);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminTestimonials();
      setTestimonials(res);
    } catch (err) {
      onNotify('error', err?.message || 'Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setIsNew(true);
    setFormData(initialForm);
    setEditingItem({ id: 'new' });
  };

  const openEdit = (t) => {
    setIsNew(false);
    setEditingItem(t);
    setFormData({
      authorName: t.authorName || '',
      authorRole: t.authorRole || '',
      companyOrChannel: t.companyOrChannel || '',
      quote: t.quote || '',
      category: t.category || 'General',
      approved: Boolean(t.approved),
      published: Boolean(t.published),
      displayOrder: t.displayOrder ?? 0,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isNew) {
        await createAdminTestimonial(formData);
        onNotify('success', 'Testimonial created.');
      } else {
        await updateAdminTestimonial(editingItem.id, formData);
        onNotify('success', 'Testimonial updated.');
      }
      setEditingItem(null);
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete review from "${t.authorName}"?`)) return;
    try {
      await deleteAdminTestimonial(t.id);
      onNotify('success', 'Testimonial deleted.');
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to delete testimonial.');
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2 className="admin-section__title">Client Testimonials</h2>
          <p className="admin-section__sub">Client endorsements displayed in the portfolio section.</p>
        </div>

        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn--glass" onClick={load}>
            <RefreshCw size={14} aria-hidden="true" />
          </button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={openNew}>
            <Plus size={15} aria-hidden="true" />
            <span>New Testimonial</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading testimonials...</div>
      ) : testimonials.length === 0 ? (
        <div className="admin-card admin-empty">
          No client testimonials published yet. The portfolio strip remains cleanly hidden until real reviews are added.
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Role / Company</th>
                  <th>Quote</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <strong>{t.authorName}</strong>
                    </td>
                    <td>{[t.authorRole, t.companyOrChannel].filter(Boolean).join(' • ')}</td>
                    <td className="admin-table__quote">&ldquo;{t.quote}&rdquo;</td>
                    <td>
                      <span className={`admin-badge admin-badge--${t.published ? 'published' : 'draft'}`}>
                        {t.published ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Edit"
                          onClick={() => openEdit(t)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          title="Delete"
                          onClick={() => handleDelete(t)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {editingItem && (
        <div className="admin-modal-backdrop" onClick={() => setEditingItem(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <div>
                <span className="admin-modal__eyebrow">
                  {isNew ? 'New Review' : 'Edit Review'}
                </span>
                <h3 className="admin-modal__title">{formData.authorName || 'Client Review'}</h3>
              </div>
              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => setEditingItem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal__body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Author Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Author Role</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Company or Channel</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.companyOrChannel}
                  onChange={(e) => setFormData({ ...formData, companyOrChannel: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Quote *</label>
                <textarea
                  className="admin-input"
                  rows={4}
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Status</label>
                  <select
                    className="admin-input"
                    value={formData.published ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        published: e.target.value === 'true',
                        approved: e.target.value === 'true',
                      })
                    }
                  >
                    <option value="true">Published (Live)</option>
                    <option value="false">Hidden (Draft)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-modal__foot">
                <button
                  type="button"
                  className="admin-btn admin-btn--glass"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* TAB: FAQS                                                                 */
/* ========================================================================= */
function FaqsTab({ onNotify }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = {
    question: '',
    answer: '',
    category: 'General',
    published: true,
    displayOrder: 0,
  };

  const [formData, setFormData] = useState(initialForm);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminFaqs();
      setFaqs(res);
    } catch (err) {
      onNotify('error', err?.message || 'Failed to load FAQs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setIsNew(true);
    setFormData(initialForm);
    setEditingItem({ id: 'new' });
  };

  const openEdit = (f) => {
    setIsNew(false);
    setEditingItem(f);
    setFormData({
      question: f.question || '',
      answer: f.answer || '',
      category: f.category || 'General',
      published: Boolean(f.published),
      displayOrder: f.displayOrder ?? 0,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isNew) {
        await createAdminFaq(formData);
        onNotify('success', 'FAQ created.');
      } else {
        await updateAdminFaq(editingItem.id, formData);
        onNotify('success', 'FAQ updated.');
      }
      setEditingItem(null);
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to save FAQ.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (f) => {
    if (!window.confirm(`Delete FAQ "${f.question}"?`)) return;
    try {
      await deleteAdminFaq(f.id);
      onNotify('success', 'FAQ deleted.');
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to delete FAQ.');
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2 className="admin-section__title">Studio FAQs</h2>
          <p className="admin-section__sub">Frequently asked questions displayed in the approach workflow section.</p>
        </div>

        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn--glass" onClick={load}>
            <RefreshCw size={14} aria-hidden="true" />
          </button>
          <button type="button" className="admin-btn admin-btn--primary" onClick={openNew}>
            <Plus size={15} aria-hidden="true" />
            <span>New FAQ</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading FAQs...</div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <strong>{f.question}</strong>
                    </td>
                    <td className="admin-table__answer">{f.answer}</td>
                    <td>{f.category}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${f.published ? 'published' : 'draft'}`}>
                        {f.published ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          title="Edit"
                          onClick={() => openEdit(f)}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          title="Delete"
                          onClick={() => handleDelete(f)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {editingItem && (
        <div className="admin-modal-backdrop" onClick={() => setEditingItem(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__head">
              <div>
                <span className="admin-modal__eyebrow">{isNew ? 'New FAQ' : 'Edit FAQ'}</span>
                <h3 className="admin-modal__title">{formData.question || 'Studio FAQ'}</h3>
              </div>
              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => setEditingItem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal__body">
              <div className="admin-form-group">
                <label className="admin-form-label">Question *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Answer *</label>
                <textarea
                  className="admin-input"
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-form-label">Category</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Publication</label>
                  <select
                    className="admin-input"
                    value={formData.published ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.value === 'true' })
                    }
                  >
                    <option value="true">Published (Live)</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal__foot">
                <button
                  type="button"
                  className="admin-btn admin-btn--glass"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* TAB: MEDIA LIBRARY                                                        */
/* ========================================================================= */
function MediaTab({ onNotify }) {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminMedia();
      setMediaList(res);
    } catch (err) {
      onNotify('error', err?.message || 'Failed to load media.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploaded = await uploadAdminMedia(file, file.name);
      onNotify('success', `File "${uploaded.originalFilename}" uploaded successfully.`);
      load();
    } catch (err) {
      onNotify('error', err?.message || 'File upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (url, key) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = async (m) => {
    if (!window.confirm(`Delete media asset "${m.originalFilename}"?`)) return;
    try {
      await deleteAdminMedia(m.id);
      onNotify('success', 'Media asset deleted.');
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to delete media asset.');
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2 className="admin-section__title">Media Library</h2>
          <p className="admin-section__sub">Upload and manage project media, images and studio assets.</p>
        </div>

        <div className="admin-actions">
          <label className="admin-btn admin-btn--primary admin-upload-btn">
            <Upload size={15} aria-hidden="true" />
            <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>
          <button type="button" className="admin-btn admin-btn--glass" onClick={load}>
            <RefreshCw size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading media assets...</div>
      ) : mediaList.length === 0 ? (
        <div className="admin-card admin-empty">
          <p>No media files uploaded yet. Upload images or video files up to 12MB.</p>
        </div>
      ) : (
        <div className="admin-media-grid">
          {mediaList.map((m) => (
            <div key={m.id} className="admin-media-card">
              <div className="admin-media-thumb">
                {m.mimeType.startsWith('image/') ? (
                  <img src={m.url} alt={m.altText || m.originalFilename} />
                ) : (
                  <div className="admin-media-placeholder">VIDEO</div>
                )}
              </div>
              <div className="admin-media-meta">
                <span className="admin-media-name" title={m.originalFilename}>
                  {m.originalFilename}
                </span>
                <span className="admin-media-size">
                  {(m.byteSize / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="admin-media-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn--sm admin-btn--glass"
                  onClick={() => handleCopyUrl(m.url, m.id)}
                >
                  {copiedKey === m.id ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedKey === m.id ? 'Copied' : 'Copy URL'}</span>
                </button>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn--danger"
                  onClick={() => handleDelete(m)}
                  title="Delete Media"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* TAB: SETTINGS                                                             */
/* ========================================================================= */
function SettingsTab({ onNotify }) {
  const [settings, setSettings] = useState({
    'brand.name': 'NexForever',
    'brand.tagline': "Built for What's Next. Made to Last.",
    'brand.availability': 'Available for New Projects',
    'contact.email': '',
    'contact.whatsapp': '',
    'contact.instagram': '',
    'contact.location': 'Worldwide • Remote Studio',
    'contact.location_map_url': '',
    'social.instagram': '',
    'social.linkedin': '',
    'social.twitter': '',
    'social.youtube': '',
    'social.behance': '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminSettings();
      const flat = {};
      if (Array.isArray(res)) {
        res.forEach((item) => {
          const k = item.key || item.settingKey;
          if (k) {
            flat[k] = item.value != null ? item.value : (item.settingValue != null ? item.settingValue : '');
          }
        });
        setSettings((prev) => ({ ...prev, ...flat }));
      } else if (res && typeof res === 'object') {
        if (res.brand) {
          flat['brand.name'] = res.brand.name || '';
          flat['brand.tagline'] = res.brand.tagline || '';
          flat['brand.availability'] = res.brand.availability || '';
        }
        if (res.contact) {
          flat['contact.email'] = res.contact.email || '';
          flat['contact.whatsapp'] = res.contact.whatsapp || '';
          flat['contact.instagram'] = res.contact.instagram || '';
          flat['contact.location'] = res.contact.location || '';
          flat['contact.location_map_url'] = res.contact.locationMapUrl || '';
        }
        if (res.social) {
          flat['social.instagram'] = res.social.instagram || '';
          flat['social.linkedin'] = res.social.linkedin || '';
          flat['social.twitter'] = res.social.twitter || '';
          flat['social.youtube'] = res.social.youtube || '';
          flat['social.behance'] = res.social.behance || '';
        }
        setSettings((prev) => ({ ...prev, ...flat }));
      }
    } catch (err) {
      onNotify('error', err?.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (key, val) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateAdminSettings(settings);
      onNotify('success', 'Studio settings updated and live across the platform.');
      load();
    } catch (err) {
      onNotify('error', err?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section__head">
        <div>
          <h2 className="admin-section__title">Studio Settings</h2>
          <p className="admin-section__sub">Configure studio branding, public contact details and social media channels.</p>
        </div>

        <button type="button" className="admin-btn admin-btn--glass" onClick={load}>
          <RefreshCw size={14} aria-hidden="true" />
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading studio settings...</div>
      ) : (
        <form onSubmit={handleSave} className="admin-card admin-settings-form">
          <div className="admin-settings-section">
            <h3 className="admin-settings-title">Brand Identity</h3>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Brand Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings['brand.name']}
                  onChange={(e) => handleChange('brand.name', e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Availability Badge</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings['brand.availability']}
                  onChange={(e) => handleChange('brand.availability', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Studio Tagline</label>
              <input
                type="text"
                className="admin-input"
                value={settings['brand.tagline']}
                onChange={(e) => handleChange('brand.tagline', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-settings-section">
            <h3 className="admin-settings-title">Contact &amp; Location</h3>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Public Email</label>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="contact@nexforever.studio"
                  value={settings['contact.email']}
                  onChange={(e) => handleChange('contact.email', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">WhatsApp Number / Link</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="+1 555 123 4567"
                  value={settings['contact.whatsapp']}
                  onChange={(e) => handleChange('contact.whatsapp', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Instagram Handle / URL</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://instagram.com/nexforever.studio"
                  value={settings['contact.instagram']}
                  onChange={(e) => handleChange('contact.instagram', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Studio Location</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings['contact.location']}
                  onChange={(e) => handleChange('contact.location', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Location Map URL (Optional Google Maps / OpenStreetMap link)</label>
              <input
                type="url"
                className="admin-input"
                placeholder="https://maps.google.com/..."
                value={settings['contact.location_map_url']}
                onChange={(e) => handleChange('contact.location_map_url', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-settings-section">
            <h3 className="admin-settings-title">Social Channels</h3>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">LinkedIn URL</label>
                <input
                  type="url"
                  className="admin-input"
                  placeholder="https://linkedin.com/company/nexforever"
                  value={settings['social.linkedin']}
                  onChange={(e) => handleChange('social.linkedin', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">X / Twitter URL</label>
                <input
                  type="url"
                  className="admin-input"
                  placeholder="https://twitter.com/nexforever"
                  value={settings['social.twitter']}
                  onChange={(e) => handleChange('social.twitter', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">YouTube URL</label>
                <input
                  type="url"
                  className="admin-input"
                  placeholder="https://youtube.com/@nexforever"
                  value={settings['social.youtube']}
                  onChange={(e) => handleChange('social.youtube', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Behance URL</label>
                <input
                  type="url"
                  className="admin-input"
                  placeholder="https://behance.net/nexforever"
                  value={settings['social.behance']}
                  onChange={(e) => handleChange('social.behance', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="admin-settings-foot">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Studio Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

