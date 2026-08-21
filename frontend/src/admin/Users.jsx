import { useState } from "react";
import {
  Search,
  UserPlus,
  MoreHorizontal,
} from "lucide-react";

import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import StatusBadge from "../components/common/statusBadge";

const initialUsers = [
  {
    id: "USR-001",
    name: "Arvind Rawat",
    email: "arvind@example.com",
    role: "ADMIN",
    status: "ACTIVE",
    lastLogin: "Today, 09:10",
  },
  {
    id: "USR-002",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    role: "MANAGER",
    status: "ACTIVE",
    lastLogin: "Today, 08:45",
  },
  {
    id: "USR-003",
    name: "Amit Kumar",
    email: "amit@example.com",
    role: "STAFF",
    status: "ACTIVE",
    lastLogin: "Yesterday",
  },
];

export default function Users() {
  const [users, setUsers] =
    useState(initialUsers);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const filteredUsers =
    users.filter((user) => {
      const query =
        search.toLowerCase();

      return (
        user.name
          .toLowerCase()
          .includes(query) ||
        user.email
          .toLowerCase()
          .includes(query)
      );
    });

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const updateRole = (role) => {
    if (!selectedUser) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              role,
            }
          : user
      )
    );

    setShowModal(false);
    setSelectedUser(null);
  };

  const toggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "ACTIVE"
                  ? "INACTIVE"
                  : "ACTIVE",
            }
          : user
      )
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-semibold">
            Users
          </h1>

          <p className="mt-1 text-[11px] text-[#77736b]">
            Manage system users and their access roles.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedUser(null);
            setShowModal(true);
          }}
        >
          <UserPlus size={13} />
          Add User
        </Button>

      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 border border-[#ddd9d1] bg-[#fbfaf7] p-4 sm:flex-row">

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
            placeholder="Search users..."
            className="form-input pl-9"
          />

        </div>

        <select className="form-input sm:w-40">
          <option value="">
            All Roles
          </option>

          <option value="ADMIN">
            Admin
          </option>

          <option value="MANAGER">
            Manager
          </option>

          <option value="STAFF">
            Staff
          </option>
        </select>

        <select className="form-input sm:w-40">
          <option value="">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>

      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-[#ddd9d1] bg-[#fbfaf7]">

        <table className="w-full min-w-[900px] border-collapse">

          <thead>
            <tr className="border-b border-[#ddd9d1] bg-[#f1efe9]">

              <th className="table-head">
                USER
              </th>

              <th className="table-head">
                ROLE
              </th>

              <th className="table-head">
                STATUS
              </th>

              <th className="table-head">
                LAST LOGIN
              </th>

              <th className="table-head text-right">
                ACTION
              </th>

            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#ebe8e1] last:border-0 hover:bg-[#f6f4ef]"
              >

                <td className="table-cell">

                  <div className="flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[9px] font-semibold text-white">
                      {getInitials(user.name)}
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold">
                        {user.name}
                      </p>

                      <p className="mt-1 text-[9px] text-[#77736b]">
                        {user.email}
                      </p>
                    </div>

                  </div>

                </td>

                <td className="table-cell">
                  <button
                    onClick={() =>
                      openRoleModal(user)
                    }
                    className="border border-[#d8d4cc] bg-[#f1efe9] px-2 py-1 text-[9px] font-semibold hover:border-black"
                  >
                    {user.role}
                  </button>
                </td>

                <td className="table-cell">
                  <StatusBadge
                    status={user.status}
                  />
                </td>

                <td className="table-cell">
                  {user.lastLogin}
                </td>

                <td className="table-cell">
                  <div className="flex justify-end gap-3">

                    <button
                      onClick={() =>
                        toggleStatus(user.id)
                      }
                      className="text-[10px] font-medium underline underline-offset-2"
                    >
                      {user.status === "ACTIVE"
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button className="text-[#77736b]">
                      <MoreHorizontal size={15} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* Role modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        title={
          selectedUser
            ? "Change User Role"
            : "Create User"
        }
        size="sm"
      >

        {selectedUser ? (
          <div>

            <p className="text-[11px] text-[#77736b]">
              Select a new role for{" "}
              <strong className="text-black">
                {selectedUser.name}
              </strong>
              .
            </p>

            <div className="mt-5 space-y-2">

              {["ADMIN", "MANAGER", "STAFF"].map(
                (role) => (
                  <button
                    key={role}
                    onClick={() =>
                      updateRole(role)
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      border
                      p-3
                      text-left
                      transition
                      ${
                        selectedUser.role ===
                        role
                          ? "border-black bg-[#f1efe9]"
                          : "border-[#d8d4cc] hover:border-black"
                      }
                    `}
                  >
                    <span className="text-[10px] font-semibold">
                      {role}
                    </span>

                    <span className="text-[9px] text-[#77736b]">
                      {getRoleDescription(role)}
                    </span>
                  </button>
                )
              )}

            </div>

          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[11px] text-[#77736b]">
              User creation form will be connected to
              the backend here.
            </p>

            <Button
              className="w-full"
              onClick={() =>
                setShowModal(false)
              }
            >
              Continue
            </Button>
          </div>
        )}

      </Modal>

    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRoleDescription(role) {
  const descriptions = {
    ADMIN: "Full system access",
    MANAGER: "Operations management",
    STAFF: "Basic operations",
  };

  return descriptions[role];
}