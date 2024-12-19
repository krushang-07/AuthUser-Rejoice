import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../slice/userSlice";
// import { useDebounce } from "use-debounce";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(""); // Store search value
  const [searchBy, setSearchBy] = useState("id"); // Store the selected search parameter (ID or Username)
  const [debounceTimer, setDebounceTimer] = useState(null); // To store the timer for debounce functionality
  const { data, status, error } = useSelector((state) => state.data);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleSignUp = () => {
    navigate("/signup");
  };
  const handleLogIn = () => {
    navigate("/login");
  };

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  // Handle input change for search
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchValue(value);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      const timer = setTimeout(() => {
        if (value.trim()) {
          dispatch(fetchData({ [searchBy]: value }));
        } else {
          dispatch(fetchData({}));
        }
      }, 1000);

      setDebounceTimer(timer);
    },
    [debounceTimer, dispatch, searchBy]
  );

  // Handle change of search type (ID or Username) from dropdown
  const handleSearchByChange = (e) => {
    const value = e.target.value;
    setSearchBy(value);

    if (searchValue.trim()) {
      dispatch(fetchData({ [value]: searchValue }));
    } else {
      dispatch(fetchData({}));
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r  bg-blue-500 p-4 shadow-lg text-white">
        <h1 className="text-3xl font-extrabold tracking-wide">
          Welcome to Dashboard
        </h1>
        <div className="flex justify-end">
          <button
            onClick={handleSignUp}
            className="px-5  py-2 m-5 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
          >
            Sign Up
          </button>
          <button
            onClick={handleLogIn}
            className="px-5 py-2 m-5 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
          >
            LogIn
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2 m-5 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="flex justify-between">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
            User Details
          </h1>
          <select onChange={handleSearchByChange} value={searchBy}>
            <option value="id">Search by ID</option>
            <option value="username">Search by Username</option>
          </select>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-white border border-gray-300 rounded-lg bg-white  focus:ring-blue-500 focus:border-blue-500 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleSearchChange}
              placeholder={`Search by ${searchBy}`}
              required
            />
          </div>
        </div>
        {/* {status === "loading" && (
          <p className="text-blue-600 text-lg font-medium">Loading...</p>
        )} */}
        {status === "loading" && (
          <div className="flex justify-center items-center h-32">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-blue-600 font-medium">Loading...</p>
          </div>
        )}
        {status === "failed" && (
          <p className="text-red-500 text-lg font-medium">{error}</p>
        )}
        {status === "succeeded" && data.length === 0 && (
          <p className="text-gray-500">No users found.</p>
        )}
        {status === "succeeded" && data.length > 0 && (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  ID
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  UserName
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Email
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Phone No.
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  City
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="odd:bg-gray-100 even:bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="border border-gray-300 px-6 py-3">
                    {item.id}
                  </td>
                  <td className="border border-gray-300 px-6 py-3">
                    {item.username}
                  </td>
                  <td className="border border-gray-300 px-6 py-3">
                    {item.email}
                  </td>
                  <td className="border border-gray-300 px-6 py-3">
                    {item.phone}
                  </td>
                  <td className="border border-gray-300 px-6 py-3">
                    {item.address?.city}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Home;

// const [searchQuery, setSearchQuery] = useState("");
// const [filteredData, setFilteredData] = useState([]);

// //--------------------------------------------------------------> Search Handle <--------------------------------------------------------

// const handleInputSearch = (e) => {
//   e.preventDefault();
//   // console.log(e.target.value);
//   const value = e.target.value;
//   setSearchQuery(value);

//   if (value === "") {
//     setFilteredData(data);
//   }
// };

// //1st fetched data from the API
// useEffect(() => {
//   if (status === "idle") {
//     dispatch(fetchData());
//   }
// }, [dispatch, status]);

// //--------------------------------------------------------------> filter the Api data by searching <--------------------------------------------------------
// const handleSearch = () => {
//   const searchLowerCase = searchQuery.toLowerCase();
//   const results = data.filter((item) => {
//     return (
//       item.name.toLowerCase().includes(searchLowerCase) ||
//       item.email.toLowerCase().includes(searchLowerCase) ||
//       item.phone.toLowerCase().includes(searchLowerCase) ||
//       item.id.toString().includes(searchLowerCase) ||
//       item.address?.city?.toLowerCase().includes(searchLowerCase)
//     );
//   });
//   console.log(results);
//   setFilteredData(results); // Set the filtered data when the search is triggered
// };

// //2nd when status succeeded then set filter data and re-render
// useEffect(() => {
//   if (status === "succeeded") {
//     setFilteredData(data); // Show all data when fetched initially
//   }
// }, [data, status]);
