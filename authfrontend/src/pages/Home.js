import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../slice/userSlice";
import { logout } from "../slice/authSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(""); // Store search value
  const [searchBy, setSearchBy] = useState("id"); // Store the selected search parameter (ID or Username)
  const [debounceTimer, setDebounceTimer] = useState(null); // Timer for debounce functionality
  const { data, status, error } = useSelector((state) => state.data);

  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const usersPerPage = 2;
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  // Calculate the indices for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = data.slice(indexOfFirstUser, indexOfLastUser);

  // Function to handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(data.length / usersPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
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
      <div className="bg-gradient-to-r bg-blue-500 p-4 shadow-lg text-white">
        <h1 className="text-3xl font-extrabold tracking-wide">
          Welcome to Dashboard
        </h1>
        <div className="flex justify-end">
          <button
            onClick={handleSignUp}
            className="px-5 py-2 m-5 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
          >
            Sign Up
          </button>
          <button
            onClick={handleLogIn}
            className="px-5 py-2 m-5 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
          >
            Log In
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
            User List
          </h1>
          <select onChange={handleSearchByChange} value={searchBy}>
            <option value="id">Search by ID</option>
            <option value="username">Search by Username</option>
          </select>
          <div className="relative">
            <input
              type="search"
              className="block w-full p-4 ps-10 text-sm text-gray-800 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              onChange={handleSearchChange}
              placeholder={`Search by ${searchBy}`}
              required
            />
          </div>
        </div>

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
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-6 py-3 text-left">
                    ID
                  </th>
                  <th className="border border-gray-300 px-6 py-3 text-left">
                    Username
                  </th>
                  <th className="border border-gray-300 px-6 py-3 text-left">
                    Email
                  </th>
                  <th className="border border-gray-300 px-6 py-3 text-left">
                    Phone
                  </th>
                  <th className="border border-gray-300 px-6 py-3 text-left">
                    City
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50 transition-colors"
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
                      {item.address.city}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-around mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="previous inline-block px-4 py-2 text-sm bg-gray-200 text-black rounded hover:bg-gray-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                &laquo; Previous
              </button>
              <div className="flex justify-center mt-4">
                {Array.from(
                  { length: Math.ceil(data.length / usersPerPage) }, //(total pages require to show according to the all user data)
                  (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)} //next page index and incremented by one
                      className={`mx-1 px-3 py-1 border rounded ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-white text-blue-500"
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                class="next inline-block px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                Next &raquo;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

// // const [searchQuery, setSearchQuery] = useState("");
// // const [filteredData, setFilteredData] = useState([]);

// // //--------------------------------------------------------------> Search Handle <--------------------------------------------------------

// // const handleInputSearch = (e) => {
// //   e.preventDefault();
// //   // console.log(e.target.value);
// //   const value = e.target.value;
// //   setSearchQuery(value);

// //   if (value === "") {
// //     setFilteredData(data);
// //   }
// // };

// // //1st fetched data from the API
// // useEffect(() => {
// //   if (status === "idle") {
// //     dispatch(fetchData());
// //   }
// // }, [dispatch, status]);

// // //--------------------------------------------------------------> filter the Api data by searching <--------------------------------------------------------
// // const handleSearch = () => {
// //   const searchLowerCase = searchQuery.toLowerCase();
// //   const results = data.filter((item) => {
// //     return (
// //       item.name.toLowerCase().includes(searchLowerCase) ||
// //       item.email.toLowerCase().includes(searchLowerCase) ||
// //       item.phone.toLowerCase().includes(searchLowerCase) ||
// //       item.id.toString().includes(searchLowerCase) ||
// //       item.address?.city?.toLowerCase().includes(searchLowerCase)
// //     );
// //   });
// //   console.log(results);
// //   setFilteredData(results); // Set the filtered data when the search is triggered
// // };

// // //2nd when status succeeded then set filter data and re-render
// // useEffect(() => {
// //   if (status === "succeeded") {
// //     setFilteredData(data); // Show all data when fetched initially
// //   }
// // }, [data, status]);
