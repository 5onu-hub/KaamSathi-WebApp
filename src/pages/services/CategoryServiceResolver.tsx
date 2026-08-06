import React from "react";
import { useParams } from "react-router-dom";
import { getServiceGroup, getServiceBySlug } from "../../data/servicesMasterData";
import { ServiceGroupDetailsPage } from "./ServiceGroupDetailsPage";
import { DynamicServiceDetailsPage } from "./DynamicServiceDetailsPage";

export function CategoryServiceResolver() {
  const { categoryId, groupSlug } = useParams<{ categoryId?: string; groupSlug?: string }>();
  const slug = groupSlug || categoryId || "";

  // Check if slug matches a Service Group
  const group = getServiceGroup(slug);
  if (group) {
    return <ServiceGroupDetailsPage />;
  }

  // Otherwise, render Dynamic Service Details Page
  return <DynamicServiceDetailsPage />;
}
