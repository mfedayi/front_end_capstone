import { useGetUserQuery } from "../api/usersAPI";
import { useGetFavoritesQuery } from "../api/favoritesAPI";

const UserProfile = () => {
  const { data: user, isLoading: userLoading } = useGetUserQuery();
  const { data: favorites, isLoading: favLoading } = useGetFavoritesQuery();

  if (userLoading || favLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>

      <h2>Your Favorite Teams:</h2>
      {favorites.length === 0 ? (
        <p>No favorite teams yet.</p>
      ) : (
        <ul>
          {favorites.map((team) => (
            <li key={team.teamId}>
              <img src={team.teamLogo} alt={team.teamName} />
              <p>{team.teamName}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserProfile;
