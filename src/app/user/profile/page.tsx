import AddTribute from "./AddTribute";
import Edit from "./Profile";

const Profile = () => {
  return (
    <div role="tablist" className="tabs tabs-lg tabs-boxed w-full">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab text-lg uppercase font-bold"
        style={{ width: "350px", padding: "10px" }}
        aria-label="Profile"
        defaultChecked
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <Edit />
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab text-lg uppercase font-bold"
        style={{ width: "350px", padding: "10px" }}
        aria-label="Add a Tribute"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        <AddTribute />
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab text-lg uppercase font-bold"
        style={{ width: "350px", padding: "10px" }}
        aria-label="Manage Your Tributes"
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        Tab content 3
      </div>
    </div>
  );
};
export default Profile;
