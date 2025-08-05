import { useEffect, useState } from "react";
import TableWrapper from "../../layouts/TableWrapper";
import PageWrapper from "../../layouts/PageWrapper";
import API from "../../utils/axiosInstance";
const TeacherList = () => {
  const [teachers, setTeacher] = useState([]);
  const fetchStudents = async () => {
    try {
      
      const res = await API.get("/api/teachers");
      setTeacher(res.data);
    } catch (err) {
      console.log({ err });
    }
  };
  const handleDelete = () => {};

const columns = [ 
  { label: "S.No", render: (_row, index) => index + 1 },
  { label: "Name", key: "name" },
  { label: "Phone", key: "phone" },
  { label: "Subject", key: "subject" },
  { label: "Email", key: "email" },
  {
    label: "Assigned Classes",
    render: (row) =>
      row.assignedClasses && row.assignedClasses.length > 0
        ? row.assignedClasses.map((cls) => `${cls.class}-${cls.section}`).join(", ")
        : "—",
  },
  {
    label: "Action",
    render: (row) => (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:underline text-xs">Edit</button>
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
    <PageWrapper      title="Teacher Directory"
      subtitle="Manage and view registered teaching staff">
      <TableWrapper
        title="Teacher Overview"
        columns={columns}
        data={teachers}
      ></TableWrapper>
    </PageWrapper>
  );
};

export default TeacherList;
