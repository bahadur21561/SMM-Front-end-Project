// Check Session on Page Load
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verify User Session
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        alert("Please login first!");
        window.location.href = "index.html";
        return;
    }

    // 2. Fetch Services from Edge Function
    loadServices();

    // 3. Logout Handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabaseClient.auth.signOut();
            alert("Logged out successfully!");
            window.location.href = "index.html";
        });
    }
});

// Load Services into Dropdown from Edge Function (JAP API)
async function loadServices() {
    const categorySelect = document.getElementById('categorySelect');
    const serviceSelect = document.getElementById('serviceSelect');

    try {
        // Edge Function Call
        const response = await fetch('https://pyfhyewkadcxpvpmagnz.supabase.co/functions/v1/jap-services', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const services = await response.json();

        if (services.error) {
            throw new Error(services.error);
        }

        if (!services || services.length === 0) {
            categorySelect.innerHTML = '<option value="">No services available</option>';
            return;
        }

        // Get Unique Categories
        const categories = [...new Set(services.map(s => s.category))];
        
        categorySelect.innerHTML = '<option value="">-- Choose Category --</option>';
        categories.forEach(cat => {
            categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
        });

        // When Category Changes, Update Services Dropdown
        categorySelect.addEventListener('change', (e) => {
            const selectedCat = e.target.value;
            const filteredServices = services.filter(s => s.category === selectedCat);

            serviceSelect.innerHTML = '<option value="">-- Choose Package --</option>';
            filteredServices.forEach(serv => {
                // serv.service = JAP Service ID, serv.rate = 30% Marked-up Rate
                serviceSelect.innerHTML += `<option value="${serv.service}" data-rate="${serv.rate}">${serv.name} - $${serv.rate}/1000</option>`;
            });
        });

    } catch (err) {
        console.error("Error loading services:", err.message);
        categorySelect.innerHTML = '<option value="">Failed to load services</option>';
    }
}
