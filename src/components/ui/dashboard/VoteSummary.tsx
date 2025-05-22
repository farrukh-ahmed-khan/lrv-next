import { Table, Button, message, Spin } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

const VoteSummary = () => {
  const [nominees, setNominees] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");

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

  const promoteToBoardMember = async (userId: string) => {
    try {
      await axios.put(
        "/api/user/update-role",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("User promoted to board member");
      fetchNominees(); 
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to update role");
    }
  };

  useEffect(() => {
    fetchNominees();
  }, []);

  const columns = [
    {
      title: "Name",
      render: (_: any, record: any) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Votes",
      dataIndex: "voteCount",
    },
    {
      title: "Action",
      render: (_: any, record: any) =>
        record.role !== "board member" ? (
          <Button onClick={() => promoteToBoardMember(record.id)}>
            Make Board Member
          </Button>
        ) : (
          <span style={{ color: "green" }}>Already Board</span>
        ),
    },
  ];

  return (
    <div>
      <h2>Vote Summary</h2>
      {loading ? <Spin /> : <Table columns={columns} dataSource={nominees} rowKey="id" />}
    </div>
  );
};

export default VoteSummary;
