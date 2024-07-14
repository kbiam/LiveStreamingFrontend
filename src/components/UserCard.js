import React from 'react';

const UserCard = ({ id, name, email, admin }) => {
  return (
    <div className="card " style={{ width: '18rem', height: 'auto', marginBottom: '16px',background:'#F0E977' }}>
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{id}</h6>
        <p className="card-text"><strong>Email: </strong>{email}</p>
        <strong>{admin ? "Admin" : "User"}</strong>
      </div>
    </div>
  );
};

export default UserCard;
