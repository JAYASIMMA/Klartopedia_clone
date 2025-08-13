import React from "react";
import "./DashboardCard.css";

interface CardProps {
  title: string;
  value: string;
  icon: string;
}

const DashboardCard: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="dashboard-card">
      <div className="text-4xl mb-2">{icon}</div>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default DashboardCard;
