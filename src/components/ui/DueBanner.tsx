"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDue } from "@/store/slices/dueSlice";
import { RootState, AppDispatch } from "@/store";

type Due = {
    _id: string;
    amount: number;
    paid: boolean;
    dueDate: string;
};

export default function DueBanner() {
    const dispatch = useDispatch<AppDispatch>();
    const { due, loading, error } = useSelector((state: RootState) => state.due);

    useEffect(() => {
        dispatch(fetchDue());
    }, [dispatch]);

    if (loading || error || !due || due.length === 0) return null;

    const unpaidDues = due.filter((d: Due) => !d.paid);

    if (unpaidDues.length === 0) return null;

    const earliestDue = unpaidDues.reduce((prev: Due, curr: Due) =>
        new Date(prev.dueDate) < new Date(curr.dueDate) ? prev : curr
    );

    const dueYear = new Date(earliestDue.dueDate).getFullYear();

    return (
        <div style={{ backgroundColor: "red", color: "white", padding: "10px", textAlign: "center", position: "fixed", zIndex: "99", width: "100%" }}>
            <strong>Important:</strong> You have an outstanding due until {dueYear}!
        </div>
    );
}
