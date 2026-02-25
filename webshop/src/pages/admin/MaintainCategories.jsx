import { useEffect, useState } from "react";

function MaintainCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", avatar: "" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", avatar: "" });

  useEffect(() => {
    fetch("https://699edb8f78dda56d396b9d19.mockapi.io/categories")
      .then(res => res.json())
      .then(json => { setCategories(json); setLoading(false); });
  }, []);

  const addCategory = () => {
    if (!newCategory.name.trim()) return;
    fetch("https://699edb8f78dda56d396b9d19.mockapi.io/categories", {
      method: "POST",
      body: JSON.stringify(newCategory),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(json => {
        setCategories(prev => [...prev, json]);
        setNewCategory({ name: "", avatar: "" });
      });
  };

  const deleteCategory = (categoryId, categoryIndex) => {
    if (!window.confirm("Delete this category?")) return;
    fetch("https://699edb8f78dda56d396b9d19.mockapi.io/categories/" + categoryId, {
      method: "DELETE"
    })
      .then(() => {
        setCategories(prev => prev.filter((_, i) => i !== categoryIndex));
      });
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditData({ name: category.name, avatar: category.avatar });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", avatar: "" });
  };

  const saveEdit = (categoryId) => {
    if (!editData.name.trim()) return;
    fetch("https://699edb8f78dda56d396b9d19.mockapi.io/categories/" + categoryId, {
      method: "PUT",
      body: JSON.stringify(editData),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(updated => {
        setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, ...updated } : c));
        cancelEdit();
      });
  };

  const filtered = categories.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const tableHeaderStyle = {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    fontWeight: "600",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    border: "none",
    borderBottom: "2px solid #e5e7eb",
    padding: "12px 16px"
  };

  const tdStyle = {
    padding: "12px 16px",
    borderColor: "#e5e7eb",
    verticalAlign: "middle",
    fontSize: "0.9rem"
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>

      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="mb-0" style={{ fontWeight: "700" }}>
        Manage Categories ({filtered.length})
        </h4>
      </div>

      {/* Add new category card */}
      <div className="card shadow-sm mb-4" style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
        <div className="card-body">
          <h6 style={{ fontWeight: "700", marginBottom: "16px", color: "#111" }}>Add new category</h6>
          <div className="d-flex gap-3 flex-wrap align-items-end">
            <div style={{ flex: 1, minWidth: "180px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#374151", marginBottom: "4px", display: "block" }}>
                Category name *
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. electronics"
                value={newCategory.name}
                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            <div style={{ flex: 2, minWidth: "220px" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: "600", color: "#374151", marginBottom: "4px", display: "block" }}>
                Image URL
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="https://..."
                value={newCategory.avatar}
                onChange={e => setNewCategory({ ...newCategory, avatar: e.target.value })}
              />
            </div>
            {newCategory.avatar && (
              <img
                src={newCategory.avatar}
                alt="preview"
                style={{ width: "42px", height: "42px", objectFit: "contain", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                onError={e => e.target.style.display = "none"}
              />
            )}
            <button
              className="btn btn-success"
              onClick={addCategory}
              disabled={!newCategory.name.trim()}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="card shadow-sm" style={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}>
        <div className="card-body p-0">

          <div className="p-3" style={{ borderBottom: "1px solid #e5e7eb" }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: "320px" }}
            />
          </div>

          {loading ? (
            <div className="text-center py-5 text-muted">Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    {["#", "ID", "Name", "Image", "Created at", "Actions"].map(h => (
                      <th key={h} style={tableHeaderStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">No categories found.</td>
                    </tr>
                  ) : (
                    filtered.map((category, index) => (
                      <tr
                        key={category.id}
                        style={{ backgroundColor: editingId === category.id ? "#fffbeb" : "#fff" }}
                        onMouseEnter={e => { if (editingId !== category.id) e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                        onMouseLeave={e => { if (editingId !== category.id) e.currentTarget.style.backgroundColor = "#fff"; }}
                      >
                        <td style={{ ...tdStyle, color: "#9ca3af", width: "48px" }}>{index + 1}</td>
                        <td style={{ ...tdStyle, color: "#9ca3af", fontSize: "0.78rem" }}>{category.id}</td>

                        {/* Name cell */}
                        <td style={tdStyle}>
                          {editingId === category.id ? (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editData.name}
                              onChange={e => setEditData({ ...editData, name: e.target.value })}
                            />
                          ) : (
                            <span style={{ fontWeight: "600" }}>{category.name}</span>
                          )}
                        </td>

                        {/* Image cell */}
                        <td style={tdStyle}>
                          {editingId === category.id ? (
                            <div className="d-flex align-items-center gap-2">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="https://..."
                                value={editData.avatar}
                                onChange={e => setEditData({ ...editData, avatar: e.target.value })}
                              />
                              {editData.avatar && (
                                <img
                                  src={editData.avatar}
                                  alt="preview"
                                  style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "6px", border: "1px solid #e5e7eb", flexShrink: 0 }}
                                  onError={e => e.target.style.display = "none"}
                                />
                              )}
                            </div>
                          ) : (
                            category.avatar ? (
                              <img
                                src={category.avatar}
                                alt={category.name}
                                style={{ width: "42px", height: "42px", objectFit: "contain", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                                onError={e => e.target.style.display = "none"}
                              />
                            ) : (
                              <span style={{ color: "#d1d5db" }}>—</span>
                            )
                          )}
                        </td>

                        <td style={{ ...tdStyle, color: "#6b7280", fontSize: "0.82rem" }}>
                          {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "—"}
                        </td>

                        {/* Actions */}
                        <td style={tdStyle}>
                          {editingId === category.id ? (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => saveEdit(category.id)}
                                disabled={!editData.name.trim()}
                              >
                                💾 Save
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => startEdit(category)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteCategory(category.id, index)}
                              >
                                🗑 Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MaintainCategories;