import React, { useEffect, useState } from 'react';

export default function HistoryView({ username = 'admin' }) {
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Change this number to show more or fewer items per page

    useEffect(() => {
        fetch(`http://localhost:8080/history?username=${username}`)
            .then((res) => res.json())
            .then((data) => {
                setHistoryList(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching history:", err);
                setLoading(false);
            });
    }, [username]);

    if (loading) return <div style={{ color: '#b4b4b4' }}>Loading activity history...</div>;

    // Calculate pagination slices
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = historyList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(historyList.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>
                Activity History
            </h2>
            
            {historyList.length === 0 ? (
                <p style={{ color: '#8e8e8e' }}>No history records found for {username}.</p>
            ) : (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                        {currentItems.map((item) => (
                            <div key={item.id} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.badge}>{item.type}</span>
                                    <span style={{ color: '#8e8e8e', fontSize: '12px' }}>
                                        {new Date(item.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <strong style={{ color: '#b4b4b4', fontSize: '13px' }}>Prompt / Input:</strong>
                                    <p style={styles.textBlock}>{item.prompt}</p>
                                </div>
                                <div>
                                    <strong style={{ color: '#b4b4b4', fontSize: '13px' }}>Response:</strong>
                                    <p style={styles.textBlock}>{item.response}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={styles.paginationContainer}>
                            <button 
                                onClick={handlePrevPage} 
                                disabled={currentPage === 1}
                                style={{
                                    ...styles.pageBtn,
                                    opacity: currentPage === 1 ? 0.4 : 1,
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Previous
                            </button>
                            
                            <span style={styles.pageIndicator}>
                                Page {currentPage} of {totalPages}
                            </span>

                            <button 
                                onClick={handleNextPage} 
                                disabled={currentPage === totalPages}
                                style={{
                                    ...styles.pageBtn,
                                    opacity: currentPage === totalPages ? 0.4 : 1,
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

const styles = {
    card: { backgroundColor: '#212121', borderRadius: '12px', border: '1px solid #333333', padding: '16px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    badge: { backgroundColor: '#3b82f6', color: '#fff', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' },
    textBlock: { backgroundColor: '#171717', border: '1px solid #2f2f2f', borderRadius: '8px', padding: '10px', marginTop: '4px', fontSize: '14px', color: '#ececec', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
    paginationContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingBottom: '20px' },
    pageBtn: { backgroundColor: '#212121', border: '1px solid #333', color: '#ececec', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '500' },
    pageIndicator: { color: '#8e8e8e', fontSize: '14px' }
};