const express = require('express');
const app = express();
const { createClient } = require('@supabase/supabase-js')
const PORT = 200;

const SUPABASE_URL = "";
const SUPABASE_KEY = "";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
async function getData() {
    const { data, error } = await supabase.from("links").select();
    if (error) {
        console.error(error);
        return [];
    }
    return data || [];
}

async function startServer() {
    let roots;
    async function getNewData() {
        roots = await getData();
    }
    getNewData();

    app.get('/:route', (req, res) => {
        getNewData();
        const { route } = req.params;
        const root = roots.find(item => item.route === route);
        if (root) {
            res.redirect(root.link);
        } else {
            res.status(404).send('Route not found');
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();
