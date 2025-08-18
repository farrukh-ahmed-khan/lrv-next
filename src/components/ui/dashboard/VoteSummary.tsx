// VoteSummary.tsx
import { Table, Button, message, Spin } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { getUsers } from "@/lib/UsersApi/api";

interface Nominee {
  _id: string;
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  streetAddress?: string;
  phoneNumber?: string;
  voteCount?: number;
  position?: string;
}

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  status: string;
  role: string;
  position: string
}

const VoteSummary = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchNominees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/voting/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNominees(res.data.nominees || []);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const assignPosition = async (position: string) => {
    if (!nominees.length) return;

    const positionNominees = nominees.filter((n) => n.position === position);

    if (!positionNominees.length) {
      message.warning(`No nominees found for ${position}`);
      return;
    }

    const topNominee = [...positionNominees].sort(
      (a, b) => (b.voteCount || 0) - (a.voteCount || 0)
    )[0];

    try {
      await axios.post(
        "/api/voting/assignPositions",
        {
          email: topNominee.email,
          position,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success(
        `Assigned "${position}" to ${topNominee.firstname} ${topNominee.lastname} (${topNominee.email})`
      );
      fetchNominees();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to update position");
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      return;
    }

    try {
      const usersRes = await getUsers(token);
      const filteredUsers = usersRes.users.filter((user: User) => user.role === "home owner");

      setUserData(filteredUsers); // keep full users with position
    } catch (error: any) {
      console.error("Failed to fetch users", error);
    }
  };


  useEffect(() => {
    fetchNominees();
    fetchData();
  }, []);

  const columns = [
    {
      title: "Name",
      render: (_: any, record: Nominee) => `${record.firstname} ${record.lastname}`,
    },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
    { title: "Votes", dataIndex: "voteCount" },
    { title: "Position", dataIndex: "position" },
    {
      title: "Assign Position",
      render: (_: any, record: Nominee) => {
        const matchedUser = (userData as any[]).find((u) => u.email === record.email);
        return matchedUser?.position ?? "N/A";
      },
    }

  ];

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        [...new Set(nominees.map((n) => n.position))].map((pos) => (
          <div key={pos}>
            <h3>{pos || "No Position Assigned"}</h3>

            {/* Assign button for this position only */}
            {pos && (
              <Button
                type="primary"
                onClick={() => assignPosition(pos)}
                style={{ marginBottom: 8 }}
              >
                Assign {pos}
              </Button>
            )}

            <Table
              columns={columns}
              dataSource={nominees.filter((n) => n.position === pos)}
              rowKey="_id"
              pagination={false}
            />
          </div>
        ))
      )}

    </div>
  );
};

export default VoteSummary;
