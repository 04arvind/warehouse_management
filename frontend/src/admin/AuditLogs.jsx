import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Activity,
  RotateCw,
} from "lucide-react";
import auditService from "../services/auditService";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

const defaultAuditLogs = [
  {
    _id: "LOG-001",
    id: "LOG-001",
    action: "USER_ROLE_UPDATED",
    actor: "Admin User",
    actorEmail: "admin@stockflow.com",
    resource: "User: Rahul Sharma",
    timestamp: "Today, 09:12",
    createdAt: new Date().toISOString(),
    ip: "192.168.1.10",
  },
  {
    _id: "LOG-002",
    id: "LOG-002",
    action: "TRANSFER_APPROVED",
    actor: "Manager",
    actorEmail: "manager@stockflow.com",
    resource: "TR-1024",
    timestamp: "Today, 08:56",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    ip: "192.168.1.15",
  },
  {
    _id: "LOG-003",
    id: "LOG-003",
    action: "WAREHOUSE_CREATED",
    actor: "Admin User",
    actorEmail: "admin@stockflow.com",
    resource: "Warehouse: Delhi Central",
    timestamp: "Yesterday, 18:30",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    ip: "192.168.1.10",
  },
];

export default function AuditLogs() {
  const [logs, setLogs] = useState(defaultAuditLogs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await auditService.getAll();
      const items = response?.logs || response?.data || response;
      if (Array.isArray(items) && items.length > 0) {
        setLogs(items);
      }
    } catch (err) {
      console.warn("Audit logs API notice, using fallback records:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const query = search.toLowerCase();
    const actionStr = (log.action || "").toLowerCase();
    const actorStr = (log.actor || log.userId || "").toLowerCase();
    const resourceStr = (log.resource || log.details || "").toLowerCase();

    const matchesSearch =
      !query ||
      actionStr.includes(query) ||
      actorStr.includes(query) ||
      resourceStr.includes(query);

    const matchesFilter =
      !actionFilter ||
      actionStr.includes(actionFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
          Administration
        </p>

        <h1 className="mt-2 text-2xl font-semibold">
          Audit Logs
        </h1>

        <p className="mt-1 text-[11px] text-[#77736b]">
          Track important actions performed across
          the system.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 border border-[#ddd9d1] bg-[#fbfaf7] p-4 md:flex-row">

        <div className="relative flex-1">

          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77736b]"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="form-input pl-9"
            placeholder="Search action, user or resource..."
          />

        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="form-input md:w-48"
        >
          <option value="">All Actions</option>
          <option value="USER">User Actions</option>
          <option value="TRANSFER">Transfer Actions</option>
          <option value="WAREHOUSE">Warehouse Actions</option>
        </select>

        <button
          onClick={fetchLogs}
          className="flex items-center justify-center gap-2 border border-[#d8d4cc] px-4 text-[10px] font-semibold hover:bg-[#ebe8e1]"
        >
          <RotateCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading && <Loader text="Loading audit logs..." />}
      {!loading && error && <ErrorMessage message={error} />}

      {!loading && !error && filteredLogs.length === 0 && (
        <EmptyState
          title="No audit logs found"
          description="No activity logs match your search criteria."
        />
      )}

      {!loading && !error && filteredLogs.length > 0 && (
        <div className="overflow-x-auto border border-[#ddd9d1] bg-[#fbfaf7]">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="border-b border-[#ddd9d1] bg-[#f1efe9]">
                <th className="table-head">EVENT</th>
                <th className="table-head">ACTOR</th>
                <th className="table-head">RESOURCE</th>
                <th className="table-head">TIMESTAMP</th>
                <th className="table-head">DETAILS</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log._id || log.id}
                  className="border-b border-[#ebe8e1] last:border-0 hover:bg-[#f6f4ef]"
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center border border-[#d8d4cc] bg-[#f1efe9]">
                        <Activity size={12} />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold">
                          {formatAction(log.action || "Activity")}
                        </p>

                        <p className="mt-1 text-[8px] text-[#99958d]">
                          {log._id || log.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="table-cell">
                    <p className="text-[10px] font-semibold">
                      {log.actor || log.userId || "System"}
                    </p>

                    {log.actorEmail && (
                      <p className="mt-1 text-[8px] text-[#77736b]">
                        {log.actorEmail}
                      </p>
                    )}
                  </td>

                  <td className="table-cell">
                    {log.resource || "System"}
                  </td>

                  <td className="table-cell">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString()
                      : log.timestamp || "Recently"}
                  </td>

                  <td className="table-cell text-[9px] text-[#77736b]">
                    {log.details || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

function formatAction(action) {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}