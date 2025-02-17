import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { format } from "date-fns";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface Props {
  avg_volt: number;
  concentration: number;
  timestamps: Date;
}

function App() {
  const [data, setData] = useState<Props[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/sample`);
      console.log(res.data.data);
      setData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateTime = (date: Date) => {
    return format(new Date(date), "dd MMMM yyyy");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center flex-col mt-4">
        <span className="text-center font-bold text-4xl my-10">
          Tampilan Data Hasil Pengukuran
        </span>
        <table className="table-auto w-[1080px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Sampel ke-</th>
              <th className="px-4 py-2">Konsentrasi formalin (%)</th>
              <th className="px-2 py-1">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, index) => (
              <tr key={index}>
                <td className="px-8 py-6 text-center">
                  {indexOfFirstRow + index + 1}
                </td>
                <td className="px-8 py-6 text-center">
                  {formatDateTime(item.timestamps)}
                </td>
                <td className="px-8 py-6 text-center">Sample ke-{index + 1}</td>
                <td className="px-8 py-6 text-center">{item.concentration}</td>
                <td className="px-2 py-1 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button
            onClick={handlePrevPage}
            className={` text-white px-4 py-4 rounded mr-2 ${
              currentPage === 1
                ? "disabled bg-gray-100"
                : "hover:bg-gray-700 bg-gray-500"
            }`}
            disabled={currentPage === 1}
          >
            <MdKeyboardArrowLeft />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-6 py-2 border mx-1 rounded ${
                index + 1 === currentPage
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            className={` text-white px-4 py-2 rounded ml-2 ${
              currentPage === totalPages
                ? "disabled bg-gray-100"
                : "hover:bg-gray-700 bg-gray-500"
            }`}
          >
            <MdKeyboardArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
