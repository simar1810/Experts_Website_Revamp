/** Google Drive file IDs for pricing-page testimonial embeds (use /preview URL in iframe). */
export const PRICING_TESTIMONIAL_VIDEOS = [
  {
    driveId: "1b7gZm4sulnLe1dFE6-IGtaB33QosZbGx",
    name: "Testimonial (Fitly)",
    stripLabel: "Fitly",
  },
  {
    driveId: "1Iz0NL48D-TfW-4-G3BMg8JEfVSNErYxP",
    name: "Testimonial",
    stripLabel: "MOV",
  },
  {
    driveId: "1rEbJ57PFkyoqSvRGte5zLFogx680WkZS",
    name: "Love the app interface",
    stripLabel: "Interface",
  },
  {
    driveId: "1VWo4RF0RY-548is-_jGjxPG51TYOx0Sp",
    name: "Sales have boosted a lot",
    stripLabel: "Sales",
  },
  {
    driveId: "1qWA1b2muj85lKvZml4wj_DLSfeLGV8iS",
    name: "After using WellnessZ — Pradeep Kumar Arya",
    stripLabel: "Pradeep A.",
  },
  {
    driveId: "1lbQgH1DB-skQEe-hxoggTY7YrkIBxjUX",
    name: "The app handles my clients well",
    stripLabel: "Clients",
  },
  {
    driveId: "1HqdMInVxMCWAODXDCb2Enhm8ET02TR1t",
    name: "Fitness trainer",
    stripLabel: "Trainer",
  },
  {
    driveId: "1UgkyS885lYkUo-CCZqiPo5tNuHEG83Oi",
    name: "Video 2",
    stripLabel: "Video 2",
  },
  {
    driveId: "1TEYWmcx2NB8aUEankQVj_ae7vwL4ymHi",
    name: "Video 1",
    stripLabel: "Video 1",
  },
];

export function googleDrivePreviewUrl(driveId) {
  return `https://drive.google.com/file/d/${driveId}/preview`;
}
