import React from 'react';

const Navbar = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/issues">Issues</a></li>
          <li><a href="/create">Create Issue</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
