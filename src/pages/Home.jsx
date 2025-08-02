import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxios from "../utils/useAxios";

const Home = () => {
  const [codes, setCodes] = useState([]);
  const api = useAxios();

  useEffect(() => {
    console.log("useEffect called");
    api
      .get("/")
      .then((response) => {
        setCodes(response.data.QRCodes);
        console.log("Codes fetched:", response.data.QRCodes);
      })
      .catch((error) => {
        console.error("Error fetching codes:", error);
      });
  }, []);

  return (
    <div className="p-6">
      <ul className="space-y-2">
        {Array.isArray(codes) &&
          codes.map((item) => (
            <li key={item.id} className="list-none">
              <Link
                to={`/qrcode/${item.id}`}
                className="block p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 text-center font-bold"
              >
                QR Code ID: {item.id}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Home;
