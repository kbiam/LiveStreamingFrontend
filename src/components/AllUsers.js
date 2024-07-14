import React, { useEffect, useState } from 'react';
import UserCard from './UserCard';
import { FaSearch } from 'react-icons/fa'; // Importing the search icon

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const getUsers = async () => {
    try {
      const responseAdmins = await fetch(`${process.env.REACT_APP_BASE_URL}/api/getAdmins`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const jsonAdmins = await responseAdmins.json();
      if (jsonAdmins.success) {
        const responseUsers = await fetch(`${process.env.REACT_APP_BASE_URL}/api/getUsers`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const jsonUsers = await responseUsers.json();

        if (jsonUsers.success) {
          setUsers([...jsonAdmins.data, ...jsonUsers.data]);
        } else {
          alert(jsonUsers.message);
        }
      } else {
        alert(jsonAdmins.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search by email" 
          value={search} 
          onChange={handleSearch} 
          className="search-input"
        />
      </div>
      <div className="user-cards">
        {Array.isArray(filteredUsers) && filteredUsers.map((user, index) => (
          <UserCard
            key={index}
            id={user._id}
            name={user.name}
            email={user.email}
            admin={user.admin} 
          />
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
