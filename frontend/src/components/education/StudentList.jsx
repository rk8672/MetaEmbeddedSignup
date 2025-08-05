import { useEffect, useState } from "react";
import TableWrapper from "../../layouts/TableWrapper";
import PageWrapper from "../../layouts/PageWrapper";
import API from "../../utils/axiosInstance";
const StudentList = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      
      const res = await API.get("/api/students");
      setStudents(res.data);
    } catch (err) {
      console.log({ err });
    }
  };
  const handleDelete = () => {};

  const columns = [
    { label: "S.No", render: (_row, index) => index + 1 },
    { label: "Name", key: "name" },
    { label: "Class", key: "class" },
    { label: "Roll No", key: "rollNo" },
    { label: "Phone", key: "parentPhone" },
    {
      label: "Action",
      render: (row) => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:underline text-xs">
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:underline text-xs"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <PageWrapper title="Student Directory" subtitle="Manage enrolled students">
      <TableWrapper
        title="Student Overview"
        columns={columns}
        data={students}
      ></TableWrapper>
    </PageWrapper>
  );
};

export default StudentList;
