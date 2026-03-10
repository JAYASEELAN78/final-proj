import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Search, Plus, X, Download, Printer,
    TrendingUp, ShoppingCart, Package, Truck,
    BarChart3, RefreshCw, Filter, Calendar
} from 'lucide-react';
import { reportsAPI } from '../services/api';
import { useToast } from '../components/common';
import { formatDate, getTodayForInput } from '../utils/dateUtils';
import { exportToExcelStyled } from '../utils/exportToExcel';
import { printReport } from '../utils/printReport';
import ReportHeader from '../components/reports/ReportHeader';

const TABS = [
    { id: 'sales', label: 'Sales', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, color: 'text-violet-600', bg: 'bg-violet-50' },
    { id: 'production', label: 'Production', icon: RefreshCw, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'dispatch', label: 'Dispatch', icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'stock', label: 'Stock', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'revenue', label: 'Revenue', icon: BarChart3, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const ReportsPage = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('sales');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: getTodayForInput(),
        status: 'All',
        search: ''
    });

    // Initialize fromDate to start of month
    useEffect(() => {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        setFilters(prev => ({ ...prev, fromDate: firstDay }));
    }, []);

    const fetchReport = async () => {
        setLoading(true);
        try {
            let response;
            const params = {
                fromDate: filters.fromDate,
                toDate: filters.toDate,
                status: filters.status,
                company: filters.search,
                name: filters.search,
                supplier: filters.search
            };

            switch (activeTab) {
                case 'sales':
                    response = await reportsAPI.getSalesReport(params);
                    break;
                case 'orders':
                    response = await reportsAPI.getOrdersReport(params);
                    break;
                case 'production':
                    response = await reportsAPI.getProductionReport(params);
                    break;
                case 'dispatch':
                    response = await reportsAPI.getDispatchReport(params);
                    break;
                case 'stock':
                    response = await reportsAPI.getStockReport(params);
                    break;
                case 'revenue':
                    response = await reportsAPI.getSalesSummary({
                        startDate: filters.fromDate,
                        endDate: filters.toDate
                    });
                    break;
                default:
                    break;
            }

            if (response?.data?.success) {
                setReportData(response.data.data || []);
            } else {
                setReportData([]);
            }
        } catch (err) {
            console.error('Report fetch failed:', err);
            toast.error('Failed to load report data');
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [activeTab]);

    const handleExport = () => {
        if (!reportData || reportData.length === 0) {
            toast.warning('No data to export');
            return;
        }

        let columns = [];
        let filename = `${activeTab}_report`;

        switch (activeTab) {
            case 'sales':
                columns = [
                    { key: 'sno', header: 'S.No', width: 8, align: 'left' },
                    { key: 'date', header: 'Date', width: 14 },
                    { key: 'invNo', header: 'Inv No', width: 15 },
                    { key: 'item', header: 'Product', width: 25 },
                    { key: 'rate', header: 'Rate', width: 12, align: 'right' },
                    { key: 'qty', header: 'Qty', width: 10, align: 'right' },
                    { key: 'total', header: 'Total', width: 15, align: 'right' },
                ];
                break;
            case 'orders':
                columns = [
                    { key: 'sno', header: 'S.No', width: 8 },
                    { key: 'orderId', header: 'Order ID', width: 15 },
                    { key: 'company', header: 'Company', width: 25 },
                    { key: 'product', header: 'Product', width: 25 },
                    { key: 'qty', header: 'Qty', width: 10, align: 'right' },
                    { key: 'date', header: 'Date', width: 14 },
                    { key: 'status', header: 'Status', width: 15 },
                ];
                break;
            case 'production':
                columns = [
                    { key: 'sno', header: 'S.No', width: 8 },
                    { key: 'orderId', header: 'Order ID', width: 15 },
                    { key: 'product', header: 'Product', width: 25 },
                    { key: 'machine', header: 'Machine', width: 15 },
                    { key: 'staff', header: 'Staff', width: 20 },
                    { key: 'startDate', header: 'Start Date', width: 14 },
                    { key: 'progress', header: 'Progress', width: 15 },
                    { key: 'completionDate', header: 'Completion', width: 14 },
                ];
                break;
            case 'dispatch':
                columns = [
                    { key: 'sno', header: 'S.No', width: 8 },
                    { key: 'orderId', header: 'Order ID', width: 15 },
                    { key: 'company', header: 'Company', width: 25 },
                    { key: 'product', header: 'Product', width: 25 },
                    { key: 'dispatchId', header: 'Dispatch ID', width: 15 },
                    { key: 'date', header: 'Date', width: 14 },
                    { key: 'transport', header: 'Transport', width: 20 },
                    { key: 'status', header: 'Status', width: 15 },
                ];
                break;
            case 'stock':
                columns = [
                    { key: 'sno', header: 'S.No', width: 8 },
                    { key: 'item', header: 'Product Name', width: 30 },
                    { key: 'size', header: 'Size', width: 10 },
                    { key: 'qty', header: 'Stock Qty', width: 12, align: 'right' },
                    { key: 'rate', header: 'Rate', width: 12, align: 'right' },
                    { key: 'total', header: 'Stock Value', width: 15, align: 'right' },
                ];
                break;
            default:
                break;
        }

        exportToExcelStyled({
            title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report`,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            columns,
            data: reportData,
            filename,
            sheetName: activeTab
        });
    };

    const handlePrint = () => {
        printReport('printable-report-content');
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reports Central</h1>
                        <p className="text-sm text-gray-500">Analyze your production and sales performance</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium transition"
                    >
                        <Download size={18} /> Export Excel
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition"
                    >
                        <Printer size={18} /> Print Report
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-4">
                <div className="space-y-1.5 min-w-[150px]">
                    <label className="text-xs font-semibold text-gray-500 uppercase ml-1">From Date</label>
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            value={filters.fromDate}
                            onChange={(e) => setFilters(p => ({ ...p, fromDate: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="space-y-1.5 min-w-[150px]">
                    <label className="text-xs font-semibold text-gray-500 uppercase ml-1">To Date</label>
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            value={filters.toDate}
                            onChange={(e) => setFilters(p => ({ ...p, toDate: e.target.value }))}
                        />
                    </div>
                </div>

                {['orders', 'dispatch'].includes(activeTab) && (
                    <div className="space-y-1.5 min-w-[150px]">
                        <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Status</label>
                        <select
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            value={filters.status}
                            onChange={(e) => setFilters(p => ({ ...p, status: e.target.value }))}
                        >
                            <option value="All">All Statuses</option>
                            {activeTab === 'orders' ? (
                                <>
                                    <option value="Pending">Pending</option>
                                    <option value="Material Received">Material Received</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Delivered">Delivered</option>
                                </>
                            ) : (
                                <>
                                    <option value="Pending">Pending</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Delivered">Delivered</option>
                                </>
                            )}
                        </select>
                    </div>
                )}

                <div className="flex-1 space-y-1.5 min-w-[200px]">
                    <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Search Keywords</label>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Enter company, product or staff name..."
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            value={filters.search}
                            onChange={(e) => setFilters(p => ({ ...p, search: e.target.value }))}
                        />
                    </div>
                </div>

                <button
                    onClick={fetchReport}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                >
                    <Filter size={18} /> Apply
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                                ? `${tab.bg} ${tab.color} border-2 border-current shadow-sm scale-105`
                                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" id="printable-report-content">
                <div className="p-6 hidden print:block">
                    <ReportHeader
                        reportTitle={`${activeTab.toUpperCase()} REPORT`}
                        fromDate={formatDate(filters.fromDate)}
                        toDate={formatDate(filters.toDate)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                {activeTab === 'sales' && (
                                    <>
                                        <th className="p-4">S.No</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Inv No</th>
                                        <th className="p-4">Product</th>
                                        <th className="p-4 text-right">Rate</th>
                                        <th className="p-4 text-right">Qty</th>
                                        <th className="p-4 text-right">Total</th>
                                    </>
                                )}
                                {activeTab === 'orders' && (
                                    <>
                                        <th className="p-4">S.No</th>
                                        <th className="p-4">Order ID</th>
                                        <th className="p-4">Company</th>
                                        <th className="p-4">Product</th>
                                        <th className="p-4 text-right">Qty</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4 text-center">Status</th>
                                    </>
                                )}
                                {activeTab === 'production' && (
                                    <>
                                        <th className="p-4">S.No</th>
                                        <th className="p-4">Order ID</th>
                                        <th className="p-4">Product</th>
                                        <th className="p-4">Machine</th>
                                        <th className="p-4">Staff</th>
                                        <th className="p-4">Start Date</th>
                                        <th className="p-4 text-center">Progress</th>
                                        <th className="p-4">Completion</th>
                                    </>
                                )}
                                {activeTab === 'dispatch' && (
                                    <>
                                        <th className="p-4">S.No</th>
                                        <th className="p-4">Order ID</th>
                                        <th className="p-4">Company</th>
                                        <th className="p-4">Product</th>
                                        <th className="p-4 text-right">Qty</th>
                                        <th className="p-4">Dispatch ID</th>
                                        <th className="p-4">Transport</th>
                                        <th className="p-4 text-center">Status</th>
                                    </>
                                )}
                                {activeTab === 'stock' && (
                                    <>
                                        <th className="p-4">S.No</th>
                                        <th className="p-4">Product</th>
                                        <th className="p-4">Size</th>
                                        <th className="p-4 text-right">Qty</th>
                                        <th className="p-4 text-right">Rate</th>
                                        <th className="p-4 text-right">Total Value</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="10" className="p-12 text-center text-gray-500">
                                        <RefreshCw size={32} className="animate-spin mx-auto mb-3 text-indigo-400" />
                                        Generating report...
                                    </td>
                                </tr>
                            ) : reportData.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="p-12 text-center text-gray-500">
                                        <FileText size={48} className="mx-auto mb-3 opacity-20" />
                                        No data found for the selected period
                                    </td>
                                </tr>
                            ) : (
                                reportData.map((row) => (
                                    <tr key={row.sno} className="hover:bg-gray-50/80 transition-colors">
                                        {activeTab === 'sales' && (
                                            <>
                                                <td className="p-4 text-gray-600">{row.sno}</td>
                                                <td className="p-4 font-medium">{formatDate(row.date)}</td>
                                                <td className="p-4 text-indigo-600 font-bold">{row.invNo}</td>
                                                <td className="p-4 text-gray-700">{row.item}</td>
                                                <td className="p-4 text-right text-gray-600">₹{row.rate}</td>
                                                <td className="p-4 text-right font-bold">{row.qty}</td>
                                                <td className="p-4 text-right font-bold text-gray-900">₹{row.total}</td>
                                            </>
                                        )}
                                        {activeTab === 'orders' && (
                                            <>
                                                <td className="p-4 text-gray-600">{row.sno}</td>
                                                <td className="p-4 font-bold text-violet-600">{row.orderId}</td>
                                                <td className="p-4 text-gray-800 font-medium">{row.company}</td>
                                                <td className="p-4 text-gray-700">{row.product}</td>
                                                <td className="p-4 text-right font-bold">{row.qty}</td>
                                                <td className="p-4 text-gray-500">{formatDate(row.date)}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${row.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                            row.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'production' && (
                                            <>
                                                <td className="p-4 text-gray-600">{row.sno}</td>
                                                <td className="p-4 font-bold text-amber-600">{row.orderId}</td>
                                                <td className="p-4 text-gray-700 font-medium">{row.product}</td>
                                                <td className="p-4 text-gray-600">{row.machine}</td>
                                                <td className="p-4 text-gray-600">{row.staff}</td>
                                                <td className="p-4 text-gray-500">{formatDate(row.startDate)}</td>
                                                <td className="p-4 text-center">
                                                    <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold">
                                                        {row.progress}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-500">{row.completionDate}</td>
                                            </>
                                        )}
                                        {activeTab === 'dispatch' && (
                                            <>
                                                <td className="p-4 text-gray-600">{row.sno}</td>
                                                <td className="p-4 font-bold text-emerald-600">{row.orderId}</td>
                                                <td className="p-4 text-gray-800 font-medium">{row.company}</td>
                                                <td className="p-4 text-gray-700">{row.product}</td>
                                                <td className="p-4 text-right font-bold">{row.qty}</td>
                                                <td className="p-4 text-gray-600 font-medium">{row.dispatchId}</td>
                                                <td className="p-4 text-gray-600">{row.transport}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${row.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'stock' && (
                                            <>
                                                <td className="p-4 text-gray-600">{row.sno}</td>
                                                <td className="p-4 font-medium text-gray-900">{row.item}</td>
                                                <td className="p-4 text-gray-600">{row.size}</td>
                                                <td className="p-4 text-right font-bold text-gray-900">{row.qty}</td>
                                                <td className="p-4 text-right text-gray-600">₹{row.rate}</td>
                                                <td className="p-4 text-right font-bold text-orange-600">₹{row.total?.toLocaleString()}</td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {(activeTab === 'sales' || activeTab === 'stock') && reportData.length > 0 && (
                            <tfoot>
                                <tr className="bg-gray-50 font-bold border-t-2 border-gray-100">
                                    <td colSpan={activeTab === 'sales' ? 6 : 5} className="p-4 text-right text-gray-900 uppercase tracking-wider text-sm">Grand Total</td>
                                    <td className="p-4 text-right text-indigo-700 text-lg">
                                        ₹{reportData.reduce((sum, r) => sum + (r.total || 0), 0).toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
