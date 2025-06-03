"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ChevronDown, ChevronUp, Eye, Download } from "lucide-react"
import TransactionDetail from "./TransactionDetails"

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" })
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [downloadingId, setDownloadingId] = useState(null)
  const transactionsPerPage = 5

  useEffect(() => {
    const mockTransactions = [
      {
        _id: { $oid: "683c8007d4817816610264e1" },
        userEmail: "farhadhossen9036@gmail.com",
        amount: { $numberInt: "100" },
        purpose: "verification",
        status: "initiated",
        transactionId: "VERIFY_1748795399203_farhadhossen9036_gmail_com",
        verificationData: {
          licenseNumber: "789",
          nid: "Sunt harum occaecat",
          additionalNotes: "Sed veniam eiusmod",
          licenseImage: "https://i.ibb.co/Gf7ZnG0T/Picsart-25-05-19-00-24-58-861.jpg",
          nidPhoto: "https://i.ibb.co/cc9M1Dqd/Riaj.jpg",
        },
        createdAt: "2025-06-01T16:29:59.204Z",
        updatedAt: "2025-06-01T16:29:59.204Z",
      },
      {
        _id: { $oid: "683c8007d4817816610264e2" },
        userEmail: "john.doe@example.com",
        amount: { $numberInt: "250" },
        purpose: "rental payment",
        status: "completed",
        transactionId: "RENTAL_1748795399204_john_doe_example_com",
        createdAt: "2025-06-02T10:15:30.204Z",
        updatedAt: "2025-06-02T10:20:45.204Z",
      },
      {
        _id: { $oid: "683c8007d4817816610264e3" },
        userEmail: "jane.smith@example.com",
        amount: { $numberInt: "150" },
        purpose: "verification",
        status: "pending",
        transactionId: "VERIFY_1748795399205_jane_smith_example_com",
        verificationData: {
          licenseNumber: "456",
          nid: "Personal ID 123456",
          additionalNotes: "Please expedite",
          licenseImage: "https://i.ibb.co/placeholder1.jpg",
          nidPhoto: "https://i.ibb.co/placeholder2.jpg",
        },
        createdAt: "2025-06-03T08:45:12.204Z",
        updatedAt: "2025-06-03T08:45:12.204Z",
      },
      {
        _id: { $oid: "683c8007d4817816610264e4" },
        userEmail: "robert.johnson@example.com",
        amount: { $numberInt: "500" },
        purpose: "premium subscription",
        status: "completed",
        transactionId: "PREMIUM_1748795399206_robert_johnson_example_com",
        createdAt: "2025-06-03T14:22:05.204Z",
        updatedAt: "2025-06-03T14:25:18.204Z",
      },
      {
        _id: { $oid: "683c8007d4817816610264e5" },
        userEmail: "sarah.williams@example.com",
        amount: { $numberInt: "75" },
        purpose: "verification",
        status: "rejected",
        transactionId: "VERIFY_1748795399207_sarah_williams_example_com",
        verificationData: {
          licenseNumber: "321",
          nid: "ID 987654",
          additionalNotes: "Resubmission after correction",
          licenseImage: "https://i.ibb.co/placeholder3.jpg",
          nidPhoto: "https://i.ibb.co/placeholder4.jpg",
        },
        createdAt: "2025-06-04T09:10:33.204Z",
        updatedAt: "2025-06-04T11:30:45.204Z",
      },
      {
        _id: { $oid: "683c8007d4817816610264e6" },
        userEmail: "michael.brown@example.com",
        amount: { $numberInt: "320" },
        purpose: "rental payment",
        status: "initiated",
        transactionId: "RENTAL_1748795399208_michael_brown_example_com",
        createdAt: "2025-06-04T16:05:22.204Z",
        updatedAt: "2025-06-04T16:05:22.204Z",
      },
    ]

    setTransactions(mockTransactions)
    setFilteredTransactions(mockTransactions)
  }, [])

  useEffect(() => {
    let result = [...transactions]

    if (searchTerm) {
      result = result.filter(
        (transaction) =>
          transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.purpose.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (statusFilter !== "all") {
      result = result.filter((transaction) => transaction.status === statusFilter)
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredTransactions(result)
  }, [transactions, searchTerm, statusFilter, sortConfig])

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetail(true)
  }

  const closeDetail = () => {
    setShowDetail(false)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString("en-US", options)
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

  const handleQuickDownload = async (transaction) => {
    setDownloadingId(transaction._id.$oid)

    try {
      const jsPDFModule = await import("jspdf")
      const jsPDF = jsPDFModule.default
      await import("jspdf-autotable")

      const doc = new jsPDF()

      doc.setFontSize(20)
      doc.setTextColor(23, 107, 135)
      doc.text("Transaction Receipt", 105, 20, { align: "center" })

      doc.setDrawColor(23, 107, 135)
      doc.setLineWidth(0.5)
      doc.line(20, 25, 190, 25)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("Transaction Details", 20, 35)

      const transactionData = [
        ["Transaction ID:", transaction.transactionId],
        ["User Email:", transaction.userEmail],
        ["Amount:", `$${transaction.amount.$numberInt}`],
        ["Purpose:", transaction.purpose],
        ["Status:", transaction.status],
        ["Created At:", formatDate(transaction.createdAt)],
        ["Updated At:", formatDate(transaction.updatedAt)],
      ]

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

      if (transaction.verificationData) {
        const lastY = doc.lastAutoTable.finalY + 10
        doc.text("Verification Data", 20, lastY)

        const verificationData = [
          ["License Number:", transaction.verificationData.licenseNumber],
          ["NID:", transaction.verificationData.nid],
          ["Additional Notes:", transaction.verificationData.additionalNotes],
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
      link.download = `Transaction_Receipt_${transaction.transactionId.substring(0, 10)}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (err) {
      console.error("Error generating PDF:", err)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setDownloadingId(null)
    }
  }

  const indexOfLastTransaction = currentPage * transactionsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction)
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="relative">
            <select
              className="pl-4 pr-10 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="initiated">Initiated</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <Filter className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("transactionId")}
                >
                  <div className="flex items-center">
                    Transaction ID
                    {sortConfig.key === "transactionId" &&
                      (sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("userEmail")}
                >
                  <div className="flex items-center">
                    User Email
                    {sortConfig.key === "userEmail" &&
                      (sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    Amount
                    {sortConfig.key === "amount" &&
                      (sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("purpose")}
                >
                  <div className="flex items-center">
                    Purpose
                    {sortConfig.key === "purpose" &&
                      (sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig.key === "createdAt" &&
                      (sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTransactions.map((transaction) => (
                <tr key={transaction._id.$oid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.transactionId.substring(0, 15)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.userEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${transaction.amount.$numberInt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {transaction.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(transaction.status)}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="px-6 py-4 flex justify-center whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetail(transaction)}
                      className="text-teal-600 hover:text-teal-900 mr-3"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    {/* <button
                      onClick={() => handleQuickDownload(transaction)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Download Receipt"
                      disabled={downloadingId === transaction._id.$oid}
                    >
                      {downloadingId === transaction._id.$oid ? (
                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full inline-block"></div>
                      ) : (
                        <Download size={18} />
                      )}
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstTransaction + 1}</span> to{" "}
                <span className="font-medium">
                  {indexOfLastTransaction > filteredTransactions.length
                    ? filteredTransactions.length
                    : indexOfLastTransaction}
                </span>{" "}
                of <span className="font-medium">{filteredTransactions.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 transform rotate-90" />
                </button>
                {[...Array(totalPages).keys()].map((number) => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === number + 1
                        ? "z-10 bg-teal-50 border-teal-500 text-teal-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 transform -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {showDetail && selectedTransaction && (
        <TransactionDetail transaction={selectedTransaction} onClose={closeDetail} />
      )}
    </div>
  )
}

export default TransactionHistory
