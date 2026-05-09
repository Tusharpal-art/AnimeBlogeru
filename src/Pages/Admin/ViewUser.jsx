import React from 'react';
import { useGetDashboardInfoQuery } from '../../services/apiSlice';

const BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || "http://192.168.31.161:5023";
const FALLBACK_AVATAR = "https://i.pinimg.com/736x/29/fb/f8/29fbf8f7ee3f0054ed645b71230603fc.jpg";
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

function getAvatarSrc(profileImagePath) {
    if (profileImagePath && ALLOWED_EXTENSIONS.some(ext => profileImagePath.toLowerCase().endsWith(ext))) {
        return `${BASE_URL}${profileImagePath}`;
    }
    return FALLBACK_AVATAR;
}

function ViewUser() {
    const { data, isLoading, isError } = useGetDashboardInfoQuery();

    if (isLoading) return <div>Loading Users...</div>;
    if (isError) return <div>Error loading users.</div>;

    const recentUsers = data?.data?.secondValue ?? [];
    //console.log("recent users", recentUsers);

    return (
        <div className="users">
            <h2>All Users</h2>
            <div className="userTable">
                <table>
                    <thead>
                        <tr>
                            <th className="col">#</th>
                            <th className="col">Avatar</th>
                            <th className="col">Name</th>
                            <th className="col">Email</th>
                            <th className="col">Phone</th>
                            <th className="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentUsers.map((user, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <img
                                        src={getAvatarSrc(user.profileImagePath ?? user.profileImage ?? user.imgPath)}
                                        alt={user.name}
                                        style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '2px solid #e53935',
                                            display: 'block',
                                            margin: '0 auto',
                                        }}
                                        onError={e => { e.currentTarget.src = FALLBACK_AVATAR; }}
                                    />
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber ?? user.phone ?? '—'}</td>
                                <td>
                                    <button className="action-btn">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ViewUser;
