import { Document, Page, View, Text, PDFDownloadLink, Image } from "@react-pdf/renderer";
import { generateQR } from "../utils/generateQR";
import { useState, useEffect } from "react";
import logo from "../assets/brand-logo.jpg";
import staticQr from "../assets/static-qr.png";

// Utility function to chunk array
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));

export default function GeneratePDF({ coupons }) {
  const [qrList, setQrList] = useState([]);

  console.log(coupons);

  // Generate QR for ALL coupons so indexing matches across pages
  useEffect(() => {
    const loadQR = async () => {
      const qrs = await Promise.all(coupons.map((c) => generateQR(JSON.stringify(c || {}))));
      setQrList(qrs);
    };
    if (coupons.length > 0) loadQR();
  }, [coupons]);

  if (!qrList.length) return <p className="text-gray-500">Preparing PDF...</p>;

  const pages = chunk(coupons, 20);

  const PDFDoc = () => (
    <Document>
      {pages.map((pageCoupons, pageIndex) => (
        <Page key={pageIndex} size="A4" style={{ flexDirection: "row", flexWrap: "wrap", padding: 10 }}>
          {pageCoupons.map((c, i) => {
            const globalIndex = pageIndex * 20 + i;
            return (
              <View
                key={globalIndex}
                style={{
                  width: "20%", // 5 columns
                  height: "25%", // 4 rows (5x4=20 per page)
                  padding: 5,
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderTopWidth: 4,
                  borderBottomWidth: 4,
                  borderColor: "#000",
                }}
              >
                {/* Logo */}
                <Image src={logo} style={{ height: 20, marginBottom: 4 }} />

                {/* Instruction Text */}
                <Text
                  style={{
                    fontWeight: "semibold",
                    fontSize: 7,
                    marginBottom: 6,
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  Scratch and scan for cashback
                </Text>

                {/* QR Code Section */}
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {/* QR Code */}
                  {qrList[globalIndex] && (
                    <Image
                      src={qrList[globalIndex]}
                      style={{
                        width: "94%",
                        margin: 0,
                        padding: 0,
                      }}
                    />
                  )}

                  {/* Rotated Text */}
                  <Text
                    wrap={false}
                    style={{
                      fontSize: 6,
                      fontWeight: "bold",
                      position: "absolute",
                      textAlign: "center",
                      left: "54%",
                      transform: "rotate(-90deg)",
                      width: 94,
                    }}
                  >
                    *For Technician use only
                  </Text>
                </View>

                {/* Internal Use Text */}
                <Text
                  style={{
                    fontWeight: "semibold",
                    fontSize: 5,
                    marginTop: 4,
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  *For Internal use only
                </Text>

                {/* Product Info Section */}
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    marginTop: 2,
                    gap: 4,
                  }}
                >
                  <Image src={staticQr} style={{ width: "50%" }} />
                  <View
                    style={{
                      width: "50%",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 5 }}>
                      <Text style={{ fontWeight: "bold" }}>Sku Code: </Text>
                      {"\n"}
                      <Text>{c?.["SKU Code"] || "NA"}</Text>
                    </Text>

                    <Text style={{ fontSize: 5 }}>
                      <Text style={{ fontWeight: "bold" }}>Sku Name: </Text>
                      {"\n"}
                      <Text>{c?.["SKU Name"] || "NA"}</Text>
                    </Text>

                    <Text style={{ fontSize: 5 }}>
                      <Text style={{ fontWeight: "bold" }}>Internal Code: </Text>
                      {"\n"}
                      <Text>{c?.["Internal Code"] || "NA"}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </Page>
      ))}
    </Document>
  );

  return (
    <PDFDownloadLink
      document={<PDFDoc />}
      fileName="coupons.pdf"
      className="w-50 h-10 flex items-center justify-center mt-5 px-4 py-2 bg-denim-600 text-white text-sm rounded-md hover:bg-denim-700 transition"
    >
      {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
    </PDFDownloadLink>
  );
}