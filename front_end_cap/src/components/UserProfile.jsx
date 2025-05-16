import { useGetMeQuery, useGetSingleUserQuery } from "../apiSlices/userSlice";
import { useGetFavoritesQuery } from "../apiSlices/favoritesSlice";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const { userId } = useParams();
  const { profile } = useSelector((state) => state.userAuth);
  const { data: user, isLoading: userLoading } = useGetSingleUserQuery(userId);
  const { data: favorites, isLoading: favLoading } = useGetFavoritesQuery(profile?.id);

  const isSelf = profile?.id === userId;

  const navigate = useNavigate();

  if (userLoading || favLoading) return <p>Loading...</p>;
  if (!user) return <p> User Not Found</p>;

  return (
    <div>
      <h2>Your Personal Man Cave</h2>
      <section className="mb-5 p-3 border rounded bg-light">
        {user.length === 0 ? (
          <p>No personal data yet.</p>
        ) : (
          <ul>
            {
              <li key={user.id}>
                <p>Email: {user.email}</p>
                <p>Username: {user.username}</p>
                <p>
                  {" "}
                  Name: {user.firstname} {user.lastname}
                </p>
                <p>
                  Member since: {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => navigate(`/update-user/${user.id}`)}
                >
                  Update User
                </button>
              </li>
            }
          </ul>
        )}
      </section>
      {isSelf && (
        <section>
          <h2>Your Favorite Teams:</h2>
          {favorites?.length === 0 ? (
            <p>No favorite teams yet.</p>
          ) : (
            <ul>
              {favorites?.map((team) => (
                <li key={team.teamId}>
                  <img src={team.teamLogo} alt={team.teamName} />
                  <p>{team.teamName}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};

export default UserProfile;