// VoteSummary.tsx
import { Table, Button, message, Spin } from "antd";
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

  const token = localStorage.getItem("token");

  const fetchNominees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/voting/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
       console.log(res.data.nominees)
      setNominees(res.data.nominees || []);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const assignPositions = async () => {
    try {
      await axios.post("/api/voting/assignPositions", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Positions updated based on votes");
      fetchNominees();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to assign positions");
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
  ];


  return (
    <div>
      <h2>Vote Summary</h2>
      <Button type="primary" onClick={assignPositions} style={{ marginBottom: 16 }}>
        Assign Positions
      </Button>
      {loading ? (
        <Spin />
      ) : (
        [...new Set(nominees.map(n => n.position))].map(pos => (
          <div key={pos}>
            <h3>{pos || "No Position Assigned"}</h3>
           
            <Table
              columns={columns}
              dataSource={nominees.filter(n => n.position === pos)}
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
