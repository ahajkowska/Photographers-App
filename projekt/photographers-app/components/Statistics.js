const Statistics = ({ statistics }) => (
  <div className="statistics">
    <h2>Gallery Statistics</h2>
    <p>Total Photos: {statistics.totalPhotos}</p>
    <p>Total Comments: {statistics.totalComments}</p>
    {statistics.topUser && (
      <p>
        User with the most photos posted: {statistics.topUser.username} ({statistics.topUser.count} photos)
      </p>
    )}
  </div>
);

export default Statistics;
