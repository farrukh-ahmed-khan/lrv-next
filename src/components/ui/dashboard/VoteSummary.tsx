import { Table, Button, message, Spin, Input } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

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

const VoteSummary = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPosition, setEditingPosition] = useState<{ [key: string]: string }>({}); // store per-user position input

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

  const updatePosition = async (email: string) => {
    try {
      await axios.post(
        "/api/voting/assignPositions", // new API endpoint
        { email, position: editingPosition[email] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Position updated successfully");
      fetchNominees();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to update position");
    }
  };

  useEffect(() => {
    fetchNominees();
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
      title: "Update Position",
      render: (_: any, record: Nominee) => (
        <>
          <Input
            placeholder="Enter new position"
            value={editingPosition[record.email] || ""}
            onChange={(e) =>
              setEditingPosition({ ...editingPosition, [record.email]: e.target.value })
            }
            style={{ width: 150, marginRight: 8 }}
          />
          <Button
            type="primary"
            onClick={() => updatePosition(record.email)}
            disabled={!editingPosition[record.email]}
          >
            Update
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Vote Summary</h2>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={nominees}
          rowKey="_id"
          pagination={false}
        />
      )}
    </div>
  );
};

export default VoteSummary;
