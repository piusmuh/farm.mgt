// Farm Management System - Main JavaScript

// Utility function to escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Update current time
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Update time every minute
setInterval(updateCurrentTime, 60000);
updateCurrentTime();

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});

// Utility functions
function formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(Number(amount))) return 'UGX 0';
    return 'UGX ' + new Intl.NumberFormat('en-UG').format(Number(amount));
}

// Smart date formatting with relative times
function smartFormatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return formatDate(dateString);
}

// Data validation helper
function validateFormData(formData, rules) {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
        const value = formData[field];
        const rule = rules[field];
        
        if (rule.required && (!value || value.toString().trim() === '')) {
            errors[field] = `${field} is required`;
        }
        
        if (rule.minLength && value && value.length < rule.minLength) {
            errors[field] = `${field} must be at least ${rule.minLength} characters`;
        }
        
        if (rule.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
            errors[field] = `${field} must be a valid email`;
        }
        
        if (rule.type === 'number' && value && isNaN(Number(value))) {
            errors[field] = `${field} must be a number`;
        }
        
        if (rule.min && value && Number(value) < rule.min) {
            errors[field] = `${field} must be at least ${rule.min}`;
        }
        
        if (rule.max && value && Number(value) > rule.max) {
            errors[field] = `${field} must be less than ${rule.max}`;
        }
    });
    
    return errors;
}

// Enhanced form validation with visual feedback
function validateFormWithRules(formId, rules) {
    const form = document.getElementById(formId);
    if (!form) return { isValid: false, errors: {} };
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const errors = validateFormData(data, rules);
    
    // Clear previous error states
    const errorElements = form.querySelectorAll('.is-invalid, .invalid-feedback');
    errorElements.forEach(el => {
        el.classList.remove('is-invalid');
        if (el.classList.contains('invalid-feedback')) {
            el.remove();
        }
    });
    
    // Apply new error states
    Object.keys(errors).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('is-invalid');
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = errors[fieldName];
            field.parentNode.appendChild(errorDiv);
        }
    });
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors,
        data: data
    };
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show loading spinner
function showLoading(element) {
    element.innerHTML = `
        <div class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
}

// Show error message
function showError(element, message) {
    element.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle"></i> ${message}
        </div>
    `;
}

// Show success message
function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the content
    const content = document.querySelector('.content');
    if (content) {
        content.insertBefore(alertDiv, content.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Generic API call function
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Table management functions
function createDataTable(containerId, data, columns, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let tableHtml = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
    `;
    
    columns.forEach(column => {
        tableHtml += `<th>${column.title}</th>`;
    });
    
    tableHtml += `
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (data && data.length > 0) {
        data.forEach(row => {
            tableHtml += '<tr>';
            columns.forEach(column => {
                let value = row[column.data];
                if (column.render) {
                    value = column.render(value, row);
                }
                tableHtml += `<td>${value}</td>`;
            });
            tableHtml += '</tr>';
        });
    } else {
        tableHtml += `
            <tr>
                <td colspan="${columns.length}" class="text-center text-muted">
                    No data available
                </td>
            </tr>
        `;
    }
    
    tableHtml += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = tableHtml;
}

// Chart helper functions
function createLineChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    return new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            ...options
        }
    });
}

function createBarChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    return new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            ...options
        }
    });
}

function createDoughnutChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            ...options
        }
    });
}

function createPieChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    return new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            ...options
        }
    });
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Clear form validation
function clearFormValidation(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const fields = form.querySelectorAll('.is-invalid');
    fields.forEach(field => {
        field.classList.remove('is-invalid');
    });
}

// Modal management
function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

function hideModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) {
        modal.hide();
    }
}

// Filter functions
function applyFilters() {
    const filters = {};
    
    // Get all filter inputs
    const filterInputs = document.querySelectorAll('.filter-input');
    filterInputs.forEach(input => {
        if (input.value) {
            filters[input.name] = input.value;
        }
    });
    
    return filters;
}

function buildFilterUrl(baseUrl, filters) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
        if (filters[key]) {
            params.append(key, filters[key]);
        }
    });
    
    return baseUrl + (params.toString() ? '?' + params.toString() : '');
}

// Enhanced export with date ranges
function exportToCSV(data, filenameOrHeaders, includeTimestampOrFilename) {
    if (!data || data.length === 0) {
        showError(document.body, 'No data to export');
        return;
    }
    
    // Handle both 2-arg (data, filename) and 3-arg (data, headers, filename) signatures
    let headers, filename, includeTimestamp;
    
    if (Array.isArray(filenameOrHeaders)) {
        // 3-arg signature: exportToCSV(data, headers, filename)
        headers = filenameOrHeaders;
        filename = includeTimestampOrFilename;
        includeTimestamp = false;
    } else {
        // 2-arg signature: exportToCSV(data, filename)
        headers = Object.keys(data[0]);
        filename = filenameOrHeaders;
        includeTimestamp = includeTimestampOrFilename !== undefined ? includeTimestampOrFilename : true;
    }
    
    let csvContent = [
        headers.join(','),
        ...data.map(row => {
            // If row is an array (pre-formatted data), use it directly
            if (Array.isArray(row)) {
                return row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
            }
            // Otherwise, map using headers
            return headers.map(header => {
                const value = row[header] || '';
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',');
        })
    ].join('\n');
    
    // Add timestamp to filename
    let finalFilename = filename;
    if (includeTimestamp) {
        const timestamp = new Date().toISOString().slice(0, 10);
        finalFilename = filename.replace('.csv', `_${timestamp}.csv`);
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    link.click();
    URL.revokeObjectURL(url);
}

// Export with filters applied
function exportFilteredData(apiEndpoint, filename, filters = {}) {
    showLoading(document.body);
    
    const url = buildFilterUrl(apiEndpoint, filters);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            exportToCSV(data, filename);
        })
        .catch(error => {
            console.error('Export error:', error);
            showError(document.body, 'Failed to export data');
        });
}

// Search functionality
function setupSearch(inputId, tableId) {
    const searchInput = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    
    if (!searchInput || !table) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Pagination
function createPagination(containerId, currentPage, totalPages, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let paginationHtml = '<nav><ul class="pagination justify-content-center">';
    
    // Previous button
    paginationHtml += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
        </li>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    // Next button
    paginationHtml += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
        </li>
    `;
    
    paginationHtml += '</ul></nav>';
    container.innerHTML = paginationHtml;
    
    // Add event listeners
    container.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.classList.contains('page-link')) {
            const page = parseInt(e.target.dataset.page);
            if (page >= 1 && page <= totalPages && page !== currentPage) {
                onPageChange(page);
            }
        }
    });
}

// Status badge helper
function createStatusBadge(status, type = 'default') {
    const statusMap = {
        'active': { class: 'status-active', text: 'Active' },
        'inactive': { class: 'status-inactive', text: 'Inactive' },
        'healthy': { class: 'status-healthy', text: 'Healthy' },
        'sick': { class: 'status-sick', text: 'Sick' },
        'growing': { class: 'status-growing', text: 'Growing' },
        'harvested': { class: 'status-harvested', text: 'Harvested' }
    };
    
    const statusInfo = statusMap[status] || { class: 'status-inactive', text: status };
    return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
}

// Number formatting
function formatNumber(num, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
}

// Date formatting
function formatDateShort(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize all popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(alert => {
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    });
});

// Global search functionality
function setupGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    let searchTimeout;
    
    const performSearch = () => {
        const query = searchInput.value.trim();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                displaySearchResults(data, query);
            })
            .catch(error => {
                console.error('Search error:', error);
                searchResults.innerHTML = '<div class="search-result-item text-muted">Search unavailable</div>';
                searchResults.style.display = 'block';
            });
    };
    
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            performSearch();
        }
    });
    
    searchButton.addEventListener('click', performSearch);
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

function displaySearchResults(results, query) {
    const searchResults = document.getElementById('searchResults');
    
    if (!results || Object.keys(results).length === 0) {
        searchResults.innerHTML = '<div class="search-result-item text-muted">No results found</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    let resultsHtml = '';
    let totalResults = 0;
    
    // Helper function to highlight matching text
    const highlightText = (text) => {
        if (!text) return '';
        const regex = new RegExp(`(${query})`, 'gi');
        return text.toString().replace(regex, '<mark>$1</mark>');
    };
    
    // Display results by category
    const categories = [
        { key: 'farms', title: 'Farms', icon: 'fa-home' },
        { key: 'crops', title: 'Crops', icon: 'fa-leaf' },
        { key: 'livestock', title: 'Livestock', icon: 'fa-paw' },
        { key: 'tasks', title: 'Tasks', icon: 'fa-tasks' }
    ];
    
    categories.forEach(category => {
        const items = results[category.key];
        if (items && items.length > 0) {
            resultsHtml += `<div class="search-result-category">${category.title}</div>`;
            items.forEach(item => {
                let title, details, link;
                
                switch(category.key) {
                    case 'farms':
                        title = item.name;
                        details = `${item.location} • ${item.size_acres} acres`;
                        link = `/farms`;
                        break;
                    case 'crops':
                        title = item.crop_name;
                        details = `${item.farm_name} • ${item.area_acres} acres • ${item.status}`;
                        link = `/crops`;
                        break;
                    case 'livestock':
                        title = `${item.animal_type} (${item.tag_number || 'No tag'})`;
                        details = `${item.farm_name} • ${item.health_status}`;
                        link = `/livestock`;
                        break;
                    case 'tasks':
                        title = item.title;
                        details = `${item.farm_name} • ${item.status} • Due: ${item.due_date ? formatDate(item.due_date) : 'No date'}`;
                        link = `/tasks`;
                        break;
                }
                
                resultsHtml += `
                    <div class="search-result-item" onclick="window.location.href='${link}'">
                        <div class="search-result-type">
                            <i class="fas ${category.icon} me-1"></i>${category.key}
                        </div>
                        <div class="search-result-title">${highlightText(title)}</div>
                        <div class="search-result-details">${highlightText(details)}</div>
                    </div>
                `;
                totalResults++;
            });
        }
    });
    
    if (totalResults === 0) {
        resultsHtml = '<div class="search-result-item text-muted">No results found for "' + query + '"</div>';
    }
    
    searchResults.innerHTML = resultsHtml;
    searchResults.style.display = 'block';
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupGlobalSearch();
});

// Bulk selection and operations
function setupBulkActions(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    table.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.classList.contains('bulk-select')) {
            const selectedCount = table.querySelectorAll('.bulk-select:checked').length;
            updateBulkActionState(selectedCount);
        }
    });
}

function updateBulkActionState(selectedCount) {
    const bulkActions = document.getElementById('bulkActions');
    if (!bulkActions) return;
    
    if (selectedCount > 0) {
        bulkActions.style.display = 'block';
        bulkActions.querySelector('.selected-count').textContent = selectedCount;
    } else {
        bulkActions.style.display = 'none';
    }
}

// Bulk delete function
function bulkDelete(apiEndpoint, tableId) {
    const selectedIds = Array.from(document.querySelectorAll(`#${tableId} .bulk-select:checked`))
        .map(checkbox => checkbox.value);
    
    if (selectedIds.length === 0) {
        showError(document.body, 'No items selected');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
        return;
    }
    
    const promises = selectedIds.map(id => 
        fetch(`${apiEndpoint}/${id}`, { method: 'DELETE' })
            .then(response => response.json())
    );
    
    Promise.all(promises)
        .then(results => {
            showSuccess(`Successfully deleted ${selectedIds.length} items`);
            // Reload the table
            if (window.loadTableData) {
                window.loadTableData();
            }
        })
        .catch(error => {
            console.error('Bulk delete error:', error);
            showError(document.body, 'Failed to delete some items');
        });
}

// Advanced filter builder
class AdvancedFilters {
    constructor() {
        this.filters = [];
    }
    
    addFilter(field, operator, value) {
        this.filters.push({ field, operator, value });
        return this;
    }
    
    toQueryString() {
        return this.filters.map(filter => 
            `filter[${filter.field}][${filter.operator}]=${encodeURIComponent(filter.value)}`
        ).join('&');
    }
    
    clear() {
        this.filters = [];
    }
}

// Date range quick selects
function setupDateRangeQuickSelects() {
    const quickSelects = document.querySelectorAll('.date-quick-select');
    quickSelects.forEach(select => {
        select.addEventListener('change', function() {
            const fromDate = document.getElementById('dateFrom');
            const toDate = document.getElementById('dateTo');
            const today = new Date();
            
            switch(this.value) {
                case 'today':
                    fromDate.value = toDate.value = today.toISOString().split('T')[0];
                    break;
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    fromDate.value = toDate.value = yesterday.toISOString().split('T')[0];
                    break;
                case 'this_week':
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay());
                    fromDate.value = startOfWeek.toISOString().split('T')[0];
                    toDate.value = today.toISOString().split('T')[0];
                    break;
                case 'this_month':
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    fromDate.value = startOfMonth.toISOString().split('T')[0];
                    toDate.value = today.toISOString().split('T')[0];
                    break;
            }
            
            // Trigger filter update
            if (window.applyFilters) {
                window.applyFilters();
            }
        });
    });
}

// Initialize in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setupDateRangeQuickSelects();
});

// Add to main.js - Generic delete function
function deleteItem(apiEndpoint, id, itemType) {
    if (!confirm(`Are you sure you want to delete this ${itemType}? This action cannot be undone.`)) {
        return;
    }
    
    fetch(`${apiEndpoint}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Delete failed');
        }
        return response.json();
    })
    .then(data => {
        showSuccess(`${itemType} deleted successfully`);
        // Reload the data based on which page we're on
        if (window.loadFarms) loadFarms();
        if (window.loadCrops) loadCrops();
        if (window.loadLivestock) loadLivestock();
        if (window.loadLabour) loadLabour();
        if (window.loadTasks) loadTasks();
        if (window.loadFinancialRecords) loadFinancialRecords();
    })
    .catch(error => {
        console.error('Delete error:', error);
        showError(document.body, `Failed to delete ${itemType}`);
    });
}

// Additional helper functions used in templates
function formatDateShort(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatNumberCompact(value, decimals = 1) {
    if (value === null || value === undefined) return '-';
    return parseFloat(value).toFixed(decimals);
}

// Override showError to accept element or message
function showError(elementOrMessage, message) {
    if (message === undefined) {
        // First argument is the message, show on body
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i> ${elementOrMessage}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const content = document.querySelector('.content');
        if (content) {
            content.insertBefore(alertDiv, content.firstChild);
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    } else {
        // First argument is element, second is message
        elementOrMessage.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle"></i> ${message}
            </div>
        `;
    }
}

// Override showSuccess to accept message only
function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const content = document.querySelector('.content');
    if (content) {
        content.insertBefore(alertDiv, content.firstChild);
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}