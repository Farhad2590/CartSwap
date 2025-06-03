import { useState } from "react"
import { X, Download, Check } from "lucide-react"

const TransactionDetail = ({ transaction, onClose }) => {
  const [downloading, setDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [error, setError] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
      return new Date(dateString).toLocaleDateString("en-US", options)
    } catch (err) {
      return "Invalid Date"
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "initiated":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAmount = (amount) => {
    if (typeof amount === 'number' && !isNaN(amount)) return amount
    
    if (amount && typeof amount === 'object' && amount.$numberInt) {
      const parsed = parseFloat(amount.$numberInt)
      return !isNaN(parsed) ? parsed : 0
    }
    
    if (amount && typeof amount === 'object') {
      const numValue = amount.value || amount.amount
      if (numValue !== undefined) {
        const parsed = parseFloat(numValue)
        return !isNaN(parsed) ? parsed : 0
      }
    }
    
    if (typeof amount === 'string') {
      const parsed = parseFloat(amount)
      return !isNaN(parsed) ? parsed : 0
    }
    
    return 0
  }

  const generateReceipt = async () => {
    setDownloading(true)
    setError(null)

    try {
      if (!transaction) {
        throw new Error("Transaction data is missing")
      }

      let jsPDF
      let doc
      
      try {
        const jsPDFModule = await import("jspdf")
        jsPDF = jsPDFModule.default || jsPDFModule.jsPDF
        
        if (!jsPDF) {
          throw new Error("jsPDF not available")
        }
        
        doc = new jsPDF()
        
        try {
          await import("jspdf-autotable")
        } catch (autoTableError) {
          console.warn("AutoTable plugin failed to load, using manual layout:", autoTableError)
        }
        
      } catch (importError) {
        console.error("Failed to import jsPDF:", importError)
        throw new Error("PDF library failed to load. Please check your internet connection and try again.")
      }

      // Header
      doc.setFontSize(20)
      doc.setTextColor(23, 107, 135) 
      doc.text("Transaction Receipt", 105, 20, { align: "center" })

      doc.setDrawColor(23, 107, 135)
      doc.setLineWidth(0.5)
      doc.line(20, 25, 190, 25)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("Transaction Details", 20, 35)

      const amount = getAmount(transaction.amount)
      
      const transactionData = [
        ["Transaction ID:", transaction.transactionId || "N/A"],
        ["User Email:", transaction.userEmail || "N/A"],
        ["Amount:", `${amount.toFixed(2)}`],
        ["Purpose:", transaction.purpose || "N/A"],
        ["Status:", transaction.status || "N/A"],
        ["Created At:", formatDate(transaction.createdAt)],
        ["Updated At:", formatDate(transaction.updatedAt)],
      ]

      // Check if autoTable is available, otherwise use manual text placement
      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          startY: 40,
          head: [],
          body: transactionData,
          theme: "plain",
          styles: { fontSize: 10 },
          columnStyles: {
            0: { fontStyle: "bold", cellWidth: 40 },
            1: { cellWidth: 100 },
          },
        })

        // Add verification data if available
        if (transaction.verificationData) {
          const lastY = doc.lastAutoTable.finalY + 10
          doc.text("Verification Data", 20, lastY)

          const verificationData = [
            ["License Number:", transaction.verificationData.licenseNumber || "N/A"],
            ["NID:", transaction.verificationData.nid || "N/A"],
            ["Additional Notes:", transaction.verificationData.additionalNotes || "N/A"],
          ]

          doc.autoTable({
            startY: lastY + 5,
            head: [],
            body: verificationData,
            theme: "plain",
            styles: { fontSize: 10 },
            columnStyles: {
              0: { fontStyle: "bold", cellWidth: 40 },
              1: { cellWidth: 100 },
            },
          })
        }
      } else {
        console.warn("Using manual text placement as autoTable is not available")
        
        let yPosition = 45
        const lineHeight = 8
        
        doc.setFontSize(10)
        
        transactionData.forEach(([label, value]) => {
          doc.setFont("helvetica", "bold")
          doc.text(label, 20, yPosition)
          doc.setFont("helvetica", "normal")
          doc.text(String(value), 80, yPosition)
          yPosition += lineHeight
        })
        
        if (transaction.verificationData) {
          yPosition += 10
          doc.setFont("helvetica", "bold")
          doc.text("Verification Data", 20, yPosition)
          yPosition += 10
          
          const verificationData = [
            ["License Number:", transaction.verificationData.licenseNumber || "N/A"],
            ["NID:", transaction.verificationData.nid || "N/A"],
            ["Additional Notes:", transaction.verificationData.additionalNotes || "N/A"],
          ]
          
          doc.setFontSize(10)
          verificationData.forEach(([label, value]) => {
            doc.setFont("helvetica", "bold")
            doc.text(label, 20, yPosition)
            doc.setFont("helvetica", "normal")
            doc.text(String(value), 80, yPosition)
            yPosition += lineHeight
          })
        }
      }

      // Footer
      const pageHeight = doc.internal.pageSize.height
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text("This is an automatically generated receipt. No signature required.", 105, pageHeight - 20, {
        align: "center",
      })
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, pageHeight - 15, { align: "center" })

      const pdfOutput = doc.output("blob")
      const url = URL.createObjectURL(pdfOutput)

      const link = document.createElement("a")
      link.href = url
      const transactionId = transaction.transactionId || "unknown"
      link.download = `Transaction_Receipt_${transactionId.substring(0, 10)}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => URL.revokeObjectURL(url), 100)

      setDownloading(false)
      setDownloadSuccess(true)

      setTimeout(() => {
        setDownloadSuccess(false)
      }, 3000)

    } catch (err) {
      console.error("Error generating PDF:", err)
      setError(err.message || "Failed to generate PDF. Please try again.")
      setDownloading(false)
    }
  }

  const displayAmount = getAmount(transaction?.amount)
  
  const safeDisplayAmount = typeof displayAmount === 'number' && !isNaN(displayAmount) ? displayAmount : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Transaction Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Transaction Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium">{transaction?.transactionId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User Email</p>
                  <p className="font-medium">{transaction?.userEmail || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">${safeDisplayAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="font-medium capitalize">{transaction?.purpose || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(transaction?.status)}`}
                  >
                    {transaction?.status || "unknown"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium">{formatDate(transaction?.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Updated At</p>
                  <p className="font-medium">{formatDate(transaction?.updatedAt)}</p>
                </div>
              </div>
            </div>

            {transaction?.verificationData && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Verification Data</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium">{transaction.verificationData.licenseNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NID</p>
                    <p className="font-medium">{transaction.verificationData.nid || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Additional Notes</p>
                    <p className="font-medium">{transaction.verificationData.additionalNotes || "N/A"}</p>
                  </div>
                  {transaction.verificationData.licenseImage && (
                    <div>
                      <p className="text-sm text-gray-500">License Image</p>
                      <div className="mt-1">
                        <img
                          src={transaction.verificationData.licenseImage}
                          alt="License"
                          className="h-32 w-auto object-cover rounded-md border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {transaction.verificationData.nidPhoto && (
                    <div>
                      <p className="text-sm text-gray-500">NID Photo</p>
                      <div className="mt-1">
                        <img
                          src={transaction.verificationData.nidPhoto}
                          alt="NID"
                          className="h-32 w-auto object-cover rounded-md border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          {error && (
            <div className="text-red-500 mr-auto text-sm">
              <p>{error}</p>
            </div>
          )}
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2">
            Close
          </button>
          <button
            onClick={generateReceipt}
            disabled={downloading}
            className={`px-4 py-2 rounded-md flex items-center ${
              downloadSuccess
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-teal-600 hover:bg-teal-700 text-white"
            }`}
          >
            {downloading ? (
              <>
                <span className="mr-2">Generating...</span>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              </>
            ) : downloadSuccess ? (
              <>
                <Check size={18} className="mr-1" />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <Download size={18} className="mr-1" />
                <span>Download Receipt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetail