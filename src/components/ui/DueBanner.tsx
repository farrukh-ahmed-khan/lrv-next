"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDue } from "@/store/slices/dueSlice";
import { RootState, AppDispatch } from "@/store";

export default function DueBanner() {
    const dispatch = useDispatch<AppDispatch>();
    const { due, loading, error } = useSelector((state: RootState) => state.due);

    useEffect(() => {
        dispatch(fetchDue());
    }, [dispatch]);

    if (loading) return null;
    if (error) return null;
    if (!due) return null;
    if (due.paid) return null;

    return (
        <div style={{ backgroundColor: "red", color: "white", padding: "10px", textAlign: "center", position: "fixed", zIndex: "99", width: "100%" }}>
            {
                console.log(due)
            }
            <strong>Important:</strong> You have an outstanding due of ${due.amount} until {new Date(due.dueDate).toLocaleDateString()}!
        </div>
    );
}
