import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [members, setMembers] = useState([
    { id: 0, name: "Ali", work: "Developer" },
    { id: 1, name: "Ayaan", work: "Designer" },
    { id: 2, name: "Zayan", work: "Manager" },
    { id: 3, name: "Ahmed", work: "UX Specialist" },
    { id: 4, name: "Hassan", work: "UX Designer" },
    { id: 5, name: "Ibrahim", work: "Developer" },
    { id: 6, name: "Omar", work: "Content Strategist" },
    { id: 7, name: "Rayan", work: "QA Engineer" },
    { id: 8, name: "Yusuf", work: "Manager" },
    { id: 9, name: "Amir", work: "Designer" },
    { id: 10, name: "Bilal", work: "UX Specialist" },
    { id: 11, name: "Fahad", work: "UX Designer" },
    { id: 12, name: "Khalid", work: "Content Strategist" },
    { id: 13, name: "Saif", work: "QA Engineer" },
    { id: 14, name: "Zaid", work: "Manager" },
    { id: 15, name: "Musa", work: "Designer" },
    { id: 16, name: "Tariq", work: "Developer" },
    { id: 17, name: "Adnan", work: "Manager" },
  ]);
  const [draggedMember, setDraggedMember] = useState(null);
  const [draggedFromTeam, setDraggedFromTeam] = useState(null);

  const filteredMembers = members.filter(
    (item) =>
      item.name.toLowerCase().includes(input.toLowerCase()) ||
      item.work.toLowerCase().includes(input.toLowerCase())
  );

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem("teams")) || [];
    setTeams(storedTeams);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim() === "") return;

    const newTeam = { name: search, members: [] };
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setSearch("");
  };

  const handleDeleteTeam = (index) => {
    const updatedTeams = teams.filter((_, i) => i !== index);
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const handleDragStart = (member, fromTeamIndex = null) => {
    setDraggedMember(member);
    setDraggedFromTeam(fromTeamIndex);
  };

  const handleDropToTeam = (teamIndex) => {
    if (!draggedMember) return;

    const updatedTeams = [...teams];

    // Remove from previous team if dragged from a team
    if (draggedFromTeam !== null) {
      updatedTeams[draggedFromTeam].members = updatedTeams[
        draggedFromTeam
      ].members.filter((m) => m.id !== draggedMember.id);
    } else {
      // Remove from the general members list
      setMembers((prev) => prev.filter((m) => m.id !== draggedMember.id));
    }

    // Add to the dropped team
    updatedTeams[teamIndex].members.push(draggedMember);

    setTeams(updatedTeams);
    setDraggedMember(null);
    setDraggedFromTeam(null);

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const handleDropToMembers = () => {
    if (!draggedMember || draggedFromTeam === null) return;

    const updatedTeams = [...teams];

    // Remove the member from the team
    updatedTeams[draggedFromTeam].members = updatedTeams[
      draggedFromTeam
    ].members.filter((m) => m.id !== draggedMember.id);

    // Add back to the general members list
    setMembers((prev) => [...prev, draggedMember]);

    setTeams(updatedTeams);
    setDraggedMember(null);
    setDraggedFromTeam(null);

    localStorage.setItem("teams", JSON.stringify(updatedTeams));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="home-cont">
      <div className="first-section">
        <h1 style={{ fontWeight: "bold" }}>Teams</h1>
        <p>Drag and drop team members into or out of the teams below.</p>
        <div className="teams">
          {teams.length > 0 ? (
            teams.map((team, index) => (
              <div
                className="team-cont"
                key={index}
                onDragOver={handleDragOver}
                onDrop={() => handleDropToTeam(index)}
              >
                <div className="head">
                  <h4 style={{ fontWeight: "bold" }}>{team.name}</h4>
                  <div className="div">
                    <span className="badge">{team.members.length}</span>
                    <div class="dropdown">
                      <a
                        class="btn"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <BsThreeDotsVertical />
                      </a>

                      <ul class="dropdown-menu">
                        <li onClick={() => handleDeleteTeam(index)}>
                          <button className="btn">Remove</button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="team-members">
                  {team.members.length > 0 ? (
                    team.members.map((member) => (
                      <div
                        key={member.id}
                        className="team-member card"
                        draggable
                        onDragStart={() => handleDragStart(member, index)}
                      >
                        <span className="badge">{member.name.charAt(0)}</span>
                        <h5>{member.name}</h5>
                        <p>{member.work}</p>
                      </div>
                    ))
                  ) : (
                    <p className="none">No members yet.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <h4 className="no">No Teams are Created...</h4>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter new team name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">+ Add New Team</button>
        </form>
      </div>

      <div
        className="second-section"
        onDragOver={handleDragOver}
        onDrop={handleDropToMembers}
      >
        <h4 style={{ fontWeight: "bold" }}>Team Members</h4>
        <form>
          <input
            type="text"
            placeholder="Search members"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
        <div className="members">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className="card"
                draggable
                onDragStart={() => handleDragStart(member)}
              >
                <span className="badge">{member.name.charAt(0)}</span>
                <h5>{member.name}</h5>
                <p>{member.work}</p>
              </div>
            ))
          ) : (
            <h3 className="none">No members found...</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
