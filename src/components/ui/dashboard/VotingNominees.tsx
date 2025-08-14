"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Button, Spin, message, Segmented } from "antd";
import axios from "axios";
import { getAllNominee } from "@/lib/VotingApi/api";
import { FaUser } from "react-icons/fa";

// Keep this in sync with backend allowed positions (or fetch from an endpoint if you add one)
const POSITIONS = ["president", "prime_minister", "minister", "secretary", "treasurer"] as const;
type Position = (typeof POSITIONS)[number];

interface Nominee {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;           
  streetAddress?: string;
  position: Position;     
}

const NomineeVote = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(false);

  // Track voting per-position, e.g. { president: true, minister: false, ... }
  const [votedByPosition, setVotedByPosition] = useState<Record<string, boolean>>({});
  const [selectedPosition, setSelectedPosition] = useState<Position>(POSITIONS[0]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchNominees = async () => {
    if (!token) {
      console.error("No token found.");
      return;
    }
    setLoading(true);
    try {
      // If your API accepts filtering: await getAllNominee(token, { position: selectedPosition })
      const data = await getAllNominee(token);
      const list = (data.nominees || []) as Nominee[];
      setNominees(list);
    } catch {
      message.error("Failed to load nominees");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (nomineeId: string, position: Position) => {
    if (!token) return message.error("No token found");
    try {
      await axios.post(
        "/api/voting/voteCandidate",
        { nomineeId, position }, // <-- include position
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`Vote for ${position.replace("_", " ")} submitted!`);
      setVotedByPosition((prev) => ({ ...prev, [position]: true }));
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Vote failed");
    }
  };

  useEffect(() => {
    fetchNominees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nominees for the currently selected position
  const filteredNominees = useMemo(
    () => nominees.filter((n) => n.position === selectedPosition),
    [nominees, selectedPosition]
  );

  return (
    <section className="votenominees-wrap">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <Segmented
            options={POSITIONS.map((p) => ({
              label: p.replace("_", " "),
              value: p,
            }))}
            value={selectedPosition}
            onChange={(val) => setSelectedPosition(val as Position)}
          />
        </div>

        {loading ? (
          <div className="loader-wrap" style={{ display: "flex", justifyContent: "center", height: "50vh" }}>
            <Spin />
          </div>
        ) : (
          <div className="row">
            {filteredNominees.length === 0 ? (
              <div className="col-12 my-5" style={{ textAlign: "center" }}>
                No nominees for {selectedPosition.replace("_", " ")} yet.
              </div>
            ) : (
              filteredNominees.map((nominee) => (
                <div className="col-lg-4 my-4" key={nominee._id}>
                  <Card
                    title={
                      <span>
                        <FaUser style={{ marginRight: 8 }} />
                        {`${nominee.firstname} ${nominee.lastname}`}
                      </span>
                    }
                    extra={<span style={{ textTransform: "capitalize" }}>{nominee.position.replace("_", " ")}</span>}
                  >
                    <p>
                      <b>Email:</b> {nominee.email}
                    </p>
                    <p>
                      <b>Role:</b> {nominee.role}
                    </p>
                    {nominee.streetAddress && (
                      <p>
                        <b>Address:</b> {nominee.streetAddress}
                      </p>
                    )}
                    <Button
                      type="dashed"
                      disabled={!!votedByPosition[nominee.position]}
                      onClick={() => handleVote(nominee._id, nominee.position)}
                      block
                    >
                      {votedByPosition[nominee.position] ? "Already Voted for this position" : "Vote for this candidate"}
                    </Button>
                  </Card>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NomineeVote;
