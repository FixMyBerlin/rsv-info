/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface GeoJSONFeatureCollectionRSV {
  id: string;
  crs: {
    type?: "name";
    properties?: {
      name?: "urn:ogc:def:crs:OGC:1.3:CRS84";
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  type: "FeatureCollection";
  features: GeoJSONFeature[];
  /**
   * @minItems 4
   */
  bbox: [number, number, number, number, ...number[]];
}
export interface GeoJSONFeature {
  type: "Feature";
  id?: number | string;
  properties: {
    id: string;
    detail_level: "exact" | "rough" | "corridor" | "approximated";
    state: "idea" | "agreement_process" | "planning" | "in_progress" | "done";
    id_rsv: string;
    planning_phase: ("pilot" | "preliminary" | "design" | "approval" | "execution") | null;
    variant: "Vorzugstrasse" | "Alternative";
    discarded: boolean;
    length: number;
    "description:planning_phase"?: string | null;
    [k: string]: unknown;
  };
  geometry: GeoJSONMultiLineString;
  /**
   * @minItems 4
   * @maxItems 4
   */
  bbox: [number, number, number, number];
  [k: string]: unknown;
}
export interface GeoJSONMultiLineString {
  type: "MultiLineString";
  coordinates: [[number, number], [number, number], ...[number, number][]][];
  [k: string]: unknown;
}
