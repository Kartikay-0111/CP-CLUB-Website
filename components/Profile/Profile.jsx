import React from 'react'

function Profile() {
  return (
    <div className="p-12 flex gap-4">
      <div className="w-[300px] p-4 shadow-md rounded-lg">sidebar</div>
      <div className="w-full p-4 shadow-md rounded-lg">main</div>
    </div>
  );
}

export default Profile