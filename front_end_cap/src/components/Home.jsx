import {
  useRegisterMutation,
  useGetLoginMutation,
} from "../apiSlices/userSlice";
import { useGetAllTeamsQuery, useGetTeamDetailsQuery } from "../api/nbaAPI";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const navigate = useNavigate();
  const { data: teams, isLoading, isError, error } = useGetAllTeamsQuery();

  // const loggedInUserId = useSelector((state) => state.userAuth.profile?.id);
  // const [deleteUser, { isLoading: isDeleting, error: deleteError }] =
  //   useDeleteUserMutation();

  if (isLoading) {
    return <h1>is loading...</h1>;
  }

  if (isError) {
    return (
      <h1>Error: {error?.data?.message || error?.status || "Unknown error"}</h1>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Welcome Home</h2>
      {teams?.map((team) => (
        <div
          key={team.teamId}
          className="book-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/teams/${team.teamName}`)}
        >
          <img
            src={team.teamLogo}
            alt={team.teamName}
            className="book-cover"
            onError={(e) => {
              e.target.onerror = null; // prevents looping
            }}
          />
          <h3 className="book-title">{team.teamLogo}</h3>
          <p className="book-author">{team.teamName}</p>
        </div>
      ))}
    </div>
  );
};
export default Home;
