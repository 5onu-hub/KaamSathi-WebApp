import React, { useEffect } from "react";

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  jsonLd?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = ["KaamSathi", "skilled workers", "daily labour", "home repair", "plumber", "electrician"],
  ogImage = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200",
  ogUrl,
  canonicalUrl,
  jsonLd
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMetaTag = (selector: string, attribute: string, value: string, contentVal: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentVal);
    };

    // Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // Meta Keywords
    if (keywords && keywords.length > 0) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords.join(", "));
    }

    // Open Graph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    if (ogUrl) {
      setMetaTag('meta[property="og:url"]', 'property', 'og:url', ogUrl);
    }

    // Canonical Link
    const currUrl = canonicalUrl || ogUrl || window.location.href;
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", currUrl);

    // JSON-LD Schema
    const schemaId = "kaamsathi-jsonld-schema";
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = schemaId;
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      // Default local business schema
      const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "KaamSathi",
        "description": description,
        "url": currUrl,
        "priceRange": "₹200 - ₹2000",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN"
        }
      };
      scriptTag.text = JSON.stringify(defaultSchema);
    }
  }, [title, description, keywords, ogImage, ogUrl, canonicalUrl, jsonLd]);

  return null;
};
