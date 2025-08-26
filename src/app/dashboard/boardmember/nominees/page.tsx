"use client";
import React, { useEffect, useState } from "react";
import { Space, Table, Modal, Form, Button, Select } from "antd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import toast from "react-hot-toast";
import ProtectedPage from "@/components/ProtectedPage";
import Navbar from "@/components/layout/dashboard/Navbar";
import Sidebar from "@/components/layout/dashboard/Sidebar";
import { addnominee, deleteNominee, getAllNominee } from "@/lib/VotingApi/api";
import { getUsers } from "@/lib/UsersApi/api";

const { Option } = Select;

// Keep this in sync with backend allowed positions (or fetch from API if you add an endpoint)
const POSITIONS = [
  "president",
  "prime_minister",
  "minister",
  "secretary",
  "treasurer",
];

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  status: string;
  role: string; // domain/user role (unchanged)
}

const Page = () => {
  const [form] = Form.useForm();
  const [isNavClosed, setIsNavClosed] = useState(false);
  const responsiveBreakpoint = 991;

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);

  // Load homeowners for selection (approved only)
  const fetchUsers = async () => {
    if (!token) {
      console.error("No token found.");
      return;
    }
    try {
      const usersRes = await getUsers(token);
      const filtered = usersRes.users.filter(
        (u: User) => u.role === "home owner" && u.status === "approved"
      );
      const users = filtered.map((u: User) => ({
        id: u._id,
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        phonenumber: u.phoneNumber,
        streetAddress: u.streetAddress,
        role: u.role,
      }));
      setUsersData(users);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error("Failed to fetch homeowners");
    }
  };

  // Load nominees list for current year
  const fetchNominees = async () => {
    if (!token) {
      console.error("No token found.");
      return;
    }
    try {
      const data = await getAllNominee(token);
      // Expecting API to return nominees with position now
      const fetched = data.nominees.map((n: any) => ({
        id: n._id,
        firstname: n.firstname,
        lastname: n.lastname,
        email: n.email,
        phonenumber: n.phoneNumber,
        streetAddress: n.streetAddress,
        role: n.role,          // existing field (kept)
        position: n.position,  // NEW field
      }));
      setUserData(fetched);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch nominees");
    }
  };

  const handleAddNominee = async (values: any) => {
    if (!token) {
      toast.error("No token found");
      return;
    }

    // values.nomineeId is the selected homeowner email (per current UI)
    const selectedUser = usersData.find((u) => u.email === values.nomineeId);
    if (!selectedUser) {
      toast.error("Selected user not found.");
      return;
    }

    if (!values.position) {
      toast.error("Please select a position.");
      return;
    }

    try {
      const payload = {
        firstname: selectedUser.firstname,
        lastname: selectedUser.lastname,
        role: selectedUser.role, // KEEP role as-is
        email: selectedUser.email,
        phoneNumber: selectedUser.phonenumber,
        streetAddress: selectedUser.streetAddress,
        position: values.position, // ✅ send position to API
      };

      await addnominee(payload, token);
      toast.success("Nominee added successfully!");
      setIsModalVisible(false);
      form.resetFields();
      fetchNominees();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong!");
    }
  };

  const handleDelete = async (nomineeId: string) => {
    if (!token) {
      toast.error("No token found");
      return;
    }
    try {
      await deleteNominee(nomineeId, token);
      toast.success("Nominee deleted successfully!");
      fetchNominees();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const columns = [
    { title: "First Name", dataIndex: "firstname", key: "firstname" },
    { title: "Last Name", dataIndex: "lastname", key: "lastname" },
    { title: "Role", dataIndex: "role", key: "role" }, 
    { title: "Position", dataIndex: "position", key: "position" }, 
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone Number", dataIndex: "phonenumber", key: "phonenumber" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsNavClosed(window.innerWidth <= responsiveBreakpoint);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchNominees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleNav = () => setIsNavClosed((s) => !s);

  return (
    <ProtectedPage allowedRoles={["board member"]}>
      <section className={`myheader ${isNavClosed ? "nav-closed" : ""}`}>
        <Navbar toggleNav={toggleNav} />
        <div className="main">
          <Sidebar isNavClosed={isNavClosed} />
          <div
            className="page-content"
            onClick={() =>
              setIsNavClosed(window.innerWidth <= responsiveBreakpoint ? true : false)
            }
          >
            <div className="row">
              <div className="col-md-12">
                <div className="row store-wrap">
                  <div className="col-lg-6 col-md-2">
                    <h6>Nominees List</h6>
                  </div>
                  <div className="col-lg-6 col-md-10">
                    <div className="d-flex justify-content-end search-wrap">
                      <Button
                        type="primary"
                        icon={<AddOutlinedIcon />}
                        onClick={() => setIsModalVisible(true)}
                      >
                        Add Nominee
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="store-table-wrap active-table">
                    <Table
                      className="responsive-table"
                      columns={columns}
                      dataSource={userData}
                      rowKey="id" // ✅ your mapped rows use "id"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Modal
              title="Add Nominee"
              open={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              onOk={() => form.submit()}
              okText="Add"
              destroyOnClose
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleAddNominee}
                preserve={false}
              >
                <Form.Item
                  name="nomineeId"
                  label="Select Homeowner"
                  rules={[{ required: true, message: "Please select a homeowner" }]}
                >
                  <Select
                    showSearch
                    placeholder="Search by name or email"
                    filterOption={(input, option) =>
                      (option?.label as string)
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={usersData.map((u) => ({
                      label: `${u.firstname} ${u.lastname} (${u.email})`,
                      value: u.email, 
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name="position"
                  label="Position"
                  rules={[{ required: true, message: "Please select a position" }]}
                >
                  <Select placeholder="Select position">
                    {POSITIONS.map((p) => (
                      <Option key={p} value={p}>
                        {p.replace("_", " ")}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
};

export default Page;
