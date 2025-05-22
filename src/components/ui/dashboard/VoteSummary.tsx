"use client"
import { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import axios from "axios";

const VoteSummary = () => {
  const [loading, setLoading] = useState(false);
  const [nominees, setNominees] = useState([]);

  const token = sessionStorage.getItem("token");

  const fetchVotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/voting/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNominees(res.data.nominees || []);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "firstname",
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
  ];

  return (
    <div>
      <h2>Vote Summary</h2>
      {loading ? <Spin /> : <Table columns={columns} dataSource={nominees} rowKey="id" />}
    </div>
  );
};

export default VoteSummary;
