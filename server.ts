import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from "@google/genai";
import { NEWS_DATA } from './data/newsData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
    const app = express();
    const PORT = 3000;
    const ADMIN_KEY = process.env.ADMIN_KEY || 'vibelab_secret';

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Database Setup
    const dataDir = path.join(__dirname, 'data_db');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    const db = new Database(path.join(dataDir, 'tools.db'));

    // Initialize Schema
    db.exec(`
        CREATE TABLE IF NOT EXISTS tools (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            shortDescription TEXT,
            description TEXT,
            keyFeatures TEXT,
            category TEXT,
            rating REAL,
            reviewCount INTEGER,
            pricing TEXT,
            imageUrl TEXT,
            tags TEXT,
            websiteUrl TEXT,
            featured INTEGER DEFAULT 0,
            status TEXT DEFAULT 'approved',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY,
            toolId TEXT NOT NULL,
            rating REAL,
            comment TEXT,
            userName TEXT DEFAULT 'Anonymous',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (toolId) REFERENCES tools(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS news (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            summary TEXT,
            content TEXT,
            date TEXT,
            source TEXT,
            originalUrl TEXT,
            imageUrl TEXT,
            author TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Migration: Add new columns if they don't exist
    try {
        db.prepare('ALTER TABLE news ADD COLUMN imageUrl TEXT').run();
    } catch (e) { /* Column likely exists */ }
    try {
        db.prepare('ALTER TABLE news ADD COLUMN author TEXT').run();
    } catch (e) { /* Column likely exists */ }
    try {
        db.prepare('ALTER TABLE tools ADD COLUMN status TEXT DEFAULT "approved"').run();
    } catch (e) { /* Column likely exists */ }

    // Seed Data if empty
    const count = db.prepare('SELECT count(*) as count FROM tools').get();
    if (count.count === 0) {
        console.log('Seeding database...');
        try {
            // Look for seedData.json in the root directory
            const seedPath = path.join(__dirname, 'seedData.json');
            if (fs.existsSync(seedPath)) {
                const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
                
                const insertTool = db.prepare(`
                    INSERT INTO tools (id, name, shortDescription, description, keyFeatures, category, rating, reviewCount, pricing, imageUrl, tags, websiteUrl, featured)
                    VALUES (@id, @name, @shortDescription, @description, @keyFeatures, @category, @rating, @reviewCount, @pricing, @imageUrl, @tags, @websiteUrl, @featured)
                `);

                const insertReview = db.prepare(`
                    INSERT INTO reviews (id, toolId, rating, comment, userName)
                    VALUES (?, ?, ?, ?, ?)
                `);

                const transaction = db.transaction((tools) => {
                    let index = 1;
                    for (const tool of tools) {
                        const toolId = index.toString();
                        insertTool.run({
                            id: toolId,
                            name: tool.name,
                            shortDescription: tool.shortDescription,
                            description: tool.description,
                            keyFeatures: JSON.stringify(tool.keyFeatures || []),
                            category: tool.category,
                            rating: tool.rating,
                            reviewCount: tool.reviewCount,
                            pricing: tool.pricing,
                            imageUrl: `https://picsum.photos/400/300?random=${index}`,
                            tags: JSON.stringify(tool.tags),
                            websiteUrl: tool.websiteUrl,
                            featured: index <= 5 ? 1 : 0
                        });

                        // Add the featured review
                        insertReview.run(
                            `rev_${toolId}`,
                            toolId,
                            tool.userReviewRating,
                            tool.userReview,
                            'VibeLab User'
                        );

                        index++;
                    }
                });
                transaction(seedData);
                console.log(`Seeded ${seedData.length} tools and reviews.`);
            } else {
                console.warn('seedData.json not found at', seedPath);
            }
        } catch (err) {
            console.error('Error seeding database:', err);
        }
    }

    // Seed News if empty
    const newsCount = db.prepare('SELECT count(*) as count FROM news').get();
    if (newsCount.count === 0) {
        console.log('Seeding news...');
        try {
            const insertNews = db.prepare(`
                INSERT INTO news (id, title, summary, content, date, source, originalUrl, imageUrl, author)
                VALUES (@id, @title, @summary, @content, @date, @source, @originalUrl, @imageUrl, @author)
            `);

            const newsTransaction = db.transaction((newsList) => {
                let index = 1;
                for (const item of newsList) {
                    insertNews.run({
                        id: index.toString(),
                        title: item.title,
                        summary: item.summary,
                        content: item.content,
                        date: item.date,
                        source: item.source,
                        originalUrl: item.originalUrl,
                        imageUrl: item.imageUrl,
                        author: item.author
                    });
                    index++;
                }
            });
            newsTransaction(NEWS_DATA);
            console.log(`Seeded ${NEWS_DATA.length} news items.`);
        } catch (err) {
            console.error('Error seeding news:', err);
        }
    }

    // Helper: Auth Middleware
    const requireAuth = (req, res, next) => {
        const key = req.headers['x-admin-key'];
        if (key !== ADMIN_KEY) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        next();
    };

    // API Routes
    app.get('/api/tools', (req, res) => {
        try {
            const tools = db.prepare('SELECT * FROM tools WHERE status = "approved" ORDER BY featured DESC, rating DESC').all();
            const parsedTools = tools.map(t => ({
                ...t,
                tags: JSON.parse(t.tags),
                keyFeatures: t.keyFeatures ? JSON.parse(t.keyFeatures) : [],
                featured: Boolean(t.featured)
            }));
            res.json(parsedTools);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/tools/:id', (req, res) => {
        try {
            const tool = db.prepare('SELECT * FROM tools WHERE id = ?').get(req.params.id);
            if (!tool) return res.status(404).json({ error: 'Tool not found' });
            
            tool.tags = JSON.parse(tool.tags);
            tool.keyFeatures = tool.keyFeatures ? JSON.parse(tool.keyFeatures) : [];
            tool.featured = Boolean(tool.featured);

            const reviews = db.prepare('SELECT * FROM reviews WHERE toolId = ? ORDER BY createdAt DESC').all(req.params.id);
            tool.reviews = reviews;

            res.json(tool);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/admin/tools', requireAuth, (req, res) => {
        try {
            const tools = db.prepare('SELECT * FROM tools ORDER BY createdAt DESC').all();
            const parsedTools = tools.map(t => ({
                ...t,
                tags: JSON.parse(t.tags),
                keyFeatures: t.keyFeatures ? JSON.parse(t.keyFeatures) : [],
                featured: Boolean(t.featured)
            }));
            res.json(parsedTools);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/admin/news', requireAuth, (req, res) => {
        try {
            const news = db.prepare('SELECT * FROM news ORDER BY date DESC').all();
            res.json(news);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put('/api/tools/:id', requireAuth, (req, res) => {
        try {
            const tool = req.body;
            const id = req.params.id;
            const update = db.prepare(`
                UPDATE tools 
                SET name = ?, shortDescription = ?, description = ?, category = ?, rating = ?, reviewCount = ?, pricing = ?, imageUrl = ?, tags = ?, websiteUrl = ?, featured = ?, status = ?
                WHERE id = ?
            `);
            update.run(tool.name, tool.shortDescription, tool.description, tool.category, tool.rating, tool.reviewCount, tool.pricing, tool.imageUrl, JSON.stringify(tool.tags), tool.websiteUrl, tool.featured ? 1 : 0, tool.status || 'approved', id);
            res.json({ id, ...tool });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.delete('/api/tools/:id', requireAuth, (req, res) => {
        try {
            db.prepare('DELETE FROM tools WHERE id = ?').run(req.params.id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put('/api/news/:id', requireAuth, (req, res) => {
        try {
            const item = req.body;
            const id = req.params.id;
            const update = db.prepare(`
                UPDATE news 
                SET title = ?, summary = ?, content = ?, date = ?, source = ?, originalUrl = ?, imageUrl = ?, author = ?
                WHERE id = ?
            `);
            update.run(item.title, item.summary, item.content, item.date, item.source, item.originalUrl, item.imageUrl, item.author, id);
            res.json({ id, ...item });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.delete('/api/news/:id', requireAuth, (req, res) => {
        try {
            db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Mock data for news
    const MOCK_NEWS = [
        {
            id: "gemini-1-5-pro",
            title: "Gemini 1.5 Pro Released",
            summary: "Google has announced the release of Gemini 1.5 Pro, featuring a massive context window and improved reasoning capabilities.",
            content: "Google has officially announced the release of **Gemini 1.5 Pro**, a significant leap forward in their AI capabilities. The new model boasts a massive context window of up to **1 million tokens**, allowing it to process vast amounts of information in a single prompt. This breakthrough enables users to upload entire books, codebases, or long videos for analysis.\n\n## Key Features\n\n*   **Massive Context Window:** Up to 1 million tokens, enabling analysis of vast datasets.\n*   **Improved Reasoning:** Outperforms predecessors in various benchmarks.\n*   **Multimodal Capabilities:** Processes text, code, images, and video seamlessly.\n\nIn addition to the context window, Gemini 1.5 Pro demonstrates improved reasoning and problem-solving skills. The model is designed to be more efficient and scalable, making it accessible for a wider range of applications. Developers and enterprise customers can now access Gemini 1.5 Pro through Google's AI Studio and Vertex AI platforms.\n\n## Impact on the Industry\n\nThis release marks a pivotal moment in the AI arms race, as context window size becomes a key differentiator. The ability to maintain coherence over such a large span of data opens up new use cases in:\n\n1.  **Legal Analysis:** Reviewing thousands of case files.\n2.  **Historical Research:** Analyzing archives of documents.\n3.  **Software Engineering:** Understanding complex codebases.\n\nGoogle's approach with the Mixture-of-Experts (MoE) architecture also suggests a focus on efficiency, ensuring that these powerful capabilities can be delivered with lower latency and cost compared to dense models of similar size.",
            date: new Date().toISOString().split('T')[0],
            source: "Google Blog",
            originalUrl: "https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/",
            imageUrl: "https://picsum.photos/seed/gemini/800/400",
            author: "Nicolai Hansen"
        },
        {
            id: "openai-sora",
            title: "OpenAI Sora Unveiled",
            summary: "OpenAI introduces Sora, a text-to-video model capable of generating realistic and imaginative scenes from text instructions.",
            content: "OpenAI has unveiled Sora, a groundbreaking text-to-video model that is set to revolutionize the content creation industry. Sora can generate high-quality videos up to a minute long while maintaining visual quality and adherence to the user's prompt. The model understands not only what the user has asked for in the prompt but also how those things exist in the physical world.\n\nSora is capable of generating complex scenes with multiple characters, specific types of motion, and accurate details of the subject and background. While the model is currently available to red teamers to assess critical areas for harms or risks, OpenAI is also granting access to a number of visual artists, designers, and filmmakers to gain feedback on how to advance the model to be most helpful for creative professionals.\n\nThe implications of Sora are vast, ranging from entertainment and education to simulation and training. However, it also raises significant ethical questions regarding deepfakes and misinformation. OpenAI has stated they are taking these risks seriously and are implementing safety measures, such as C2PA metadata, to help identify AI-generated content. The release of Sora has undoubtedly accelerated the conversation around the regulation and ethical use of generative video technology.",
            date: new Date().toISOString().split('T')[0],
            source: "OpenAI",
            originalUrl: "https://openai.com/sora",
            imageUrl: "https://picsum.photos/seed/sora/800/400",
            author: "Nicolai Hansen"
        },
        {
            id: "anthropic-claude-3",
            title: "Anthropic Claude 3 Family",
            summary: "Anthropic releases the Claude 3 model family, setting new industry benchmarks across a wide range of cognitive tasks.",
            content: "Anthropic has announced the release of the Claude 3 model family, which includes three state-of-the-art models: Claude 3 Haiku, Claude 3 Sonnet, and Claude 3 Opus. Each model offers a different balance of intelligence, speed, and cost, allowing users to choose the best fit for their specific needs. Claude 3 Opus, the most intelligent model, outperforms GPT-4 and Gemini 1.0 Ultra on a wide range of benchmarks.\n\nThe Claude 3 models show improved capabilities in analysis and forecasting, nuanced content creation, code generation, and conversing in non-English languages like Spanish, Japanese, and French. They also exhibit fewer refusals than previous generations, showing a better understanding of context and nuance. The models are available now for use in the Claude API and on claude.ai.",
            date: new Date().toISOString().split('T')[0],
            source: "Anthropic",
            originalUrl: "https://www.anthropic.com/news/claude-3-family",
            imageUrl: "https://picsum.photos/seed/claude/800/400",
            author: "Nicolai Hansen"
        },
        {
            id: "meta-llama-3",
            title: "Meta Llama 3 Announcement",
            summary: "Meta announces the upcoming release of Llama 3, promising significant improvements in performance and capabilities for open-source AI.",
            content: "Meta has officially announced that Llama 3, the next generation of its open-source large language model, is in the works. While specific details on the release date and technical specifications are still under wraps, Meta has confirmed that Llama 3 will be trained on a significantly larger dataset than its predecessor. This is expected to result in major improvements in reasoning, coding, and general knowledge capabilities.\n\nThe announcement underscores Meta's commitment to open-source AI, aiming to democratize access to powerful AI tools. Llama 3 is expected to be a strong competitor in the open-source landscape, potentially rivaling proprietary models from other tech giants. The AI community is eagerly anticipating the release, which is expected to spur further innovation and development in the field.",
            date: new Date().toISOString().split('T')[0],
            source: "Meta AI",
            originalUrl: "https://ai.meta.com/blog/",
            imageUrl: "https://picsum.photos/seed/llama/800/400",
            author: "Nicolai Hansen"
        },
        {
            id: "mistral-large",
            title: "Mistral Large Released",
            summary: "Mistral AI releases Mistral Large, a new cutting-edge text generation model with top-tier reasoning capabilities.",
            content: "Mistral AI, a French AI startup, has released Mistral Large, its most advanced large language model to date. Mistral Large is designed to compete with top-tier models like GPT-4 and Claude 2, offering exceptional reasoning capabilities and proficiency in code generation and mathematics. It is natively fluent in English, French, Spanish, German, and Italian, making it a versatile tool for global applications.\n\nAlongside the model release, Mistral AI also announced a partnership with Microsoft, which will make Mistral Large available on Azure AI Studio and Azure Machine Learning. This collaboration will provide developers with easy access to Mistral's powerful models within the Azure ecosystem. Mistral Large is also available through Mistral's own platform, La Plateforme.",
            date: new Date().toISOString().split('T')[0],
            source: "Mistral AI",
            originalUrl: "https://mistral.ai/news/mistral-large/",
            imageUrl: "https://picsum.photos/seed/mistral/800/400",
            author: "Nicolai Hansen"
        },
        {
            id: "apple-mm1",
            title: "Apple AI Research",
            summary: "Apple publishes new research on MM1, a family of multimodal models, signaling increased investment in generative AI technologies.",
            content: "Apple has published a new research paper detailing MM1, a family of multimodal large language models (MLLMs). The paper reveals that Apple has been quietly working on advanced AI models that can process both images and text. The MM1 models demonstrate strong performance in pre-training metrics and achieve competitive results on a range of established multimodal benchmarks.\n\nThis publication is a significant signal of Apple's growing investment and progress in generative AI. While Apple has been relatively quiet compared to other tech giants in the AI race, this research suggests that they are developing powerful foundation models that could power future features in Siri, iOS, and other Apple products. The paper highlights the importance of scaling both image and text components for achieving state-of-the-art performance.",
            date: new Date().toISOString().split('T')[0],
            source: "Apple Machine Learning Research",
            originalUrl: "https://machinelearning.apple.com/",
            imageUrl: "https://picsum.photos/seed/apple/800/400",
            author: "Nicolai Hansen"
        }
    ];

    app.get('/api/news', async (req, res) => {
        try {
            // 1. Check DB for recent news (e.g., last 24 hours)
            // For simplicity, just check if we have any news for today
            const today = new Date().toISOString().split('T')[0];
            const existingNews = db.prepare('SELECT * FROM news WHERE date = ?').all(today);

            if (existingNews.length > 0) {
                return res.json(existingNews);
            }

            // 2. If no news, fetch from Gemini
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                console.warn("GEMINI_API_KEY not found, returning mock news.");
                return res.json(MOCK_NEWS);
            }

            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: {
                    parts: [
                        {
                            text: "Search for the latest and most significant AI news headlines from the last 7 days. Select the top 6 stories. For each story, write a comprehensive, unique, and engaging blog post. Do not limit the length; cover the story in full detail (similar length to original reporting) but rewrite it entirely in a unique voice to avoid plagiarism. Focus on the event, its details, and its broader impact. Return a JSON array of objects, where each object has: 'title', 'summary' (2-3 sentences), 'content' (the full blog post in Markdown), 'date' (YYYY-MM-DD), 'source' (publication name), 'originalUrl' (if available, otherwise empty string), 'imageUrl' (a relevant https://picsum.photos/seed/{keyword}/800/400 URL based on the topic), and 'author' (always 'Nicolai Hansen')."
                        }
                    ]
                },
                config: {
                    tools: [{ googleSearch: {} }],
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                summary: { type: Type.STRING },
                                content: { type: Type.STRING },
                                date: { type: Type.STRING },
                                source: { type: Type.STRING },
                                originalUrl: { type: Type.STRING },
                                imageUrl: { type: Type.STRING },
                                author: { type: Type.STRING }
                            },
                            required: ["title", "summary", "content", "date", "source", "imageUrl", "author"]
                        }
                    }
                }
            });

            const newsText = response.text;
            if (!newsText) {
                throw new Error("Empty response from Gemini");
            }
            const newsItems = JSON.parse(newsText);

            // 3. Save to DB
            const insertNews = db.prepare(`
                INSERT INTO news (id, title, summary, content, date, source, originalUrl, imageUrl, author)
                VALUES (@id, @title, @summary, @content, @date, @source, @originalUrl, @imageUrl, @author)
            `);

            const transaction = db.transaction((items) => {
                for (const item of items) {
                    // Generate a simple ID
                    const id = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
                    insertNews.run({
                        id,
                        title: item.title,
                        summary: item.summary,
                        content: item.content,
                        date: item.date,
                        source: item.source,
                        originalUrl: item.originalUrl || '',
                        imageUrl: item.imageUrl || `https://picsum.photos/seed/${id}/800/400`,
                        author: item.author || 'Nicolai Hansen'
                    });
                    item.id = id; // Add ID to response
                }
            });

            transaction(newsItems);
            res.json(newsItems);

        } catch (error: any) {
            // Check for invalid API key error
            if (error.message?.includes('API key not valid') || error.status === 400) {
                console.warn("Invalid Gemini API key, returning mock news.");
            } else {
                console.error("News fetch error:", error);
            }
            // Fallback to mock data on error
            res.json(MOCK_NEWS);
        }
    });

    app.get('/api/news/:id', (req, res) => {
        try {
            const newsItem = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id);
            if (newsItem) {
                res.json(newsItem);
            } else {
                // Check mock data
                const mockItem = MOCK_NEWS.find(n => n.id === req.params.id);
                if (mockItem) {
                    res.json(mockItem);
                } else {
                    res.status(404).json({ error: "News item not found" });
                }
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/tools', requireAuth, (req, res) => {
        try {
            const tool = req.body;
            const id = Date.now().toString();
            const insert = db.prepare(`
                INSERT INTO tools (id, name, shortDescription, description, category, rating, reviewCount, pricing, imageUrl, tags, websiteUrl, featured, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            insert.run(id, tool.name, tool.shortDescription, tool.description, tool.category, tool.rating || 0, tool.reviewCount || 0, tool.pricing, tool.imageUrl, JSON.stringify(tool.tags || []), tool.websiteUrl, tool.featured ? 1 : 0, 'approved');
            res.status(201).json({ id, ...tool });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/tools/submit', (req, res) => {
        try {
            const tool = req.body;
            const id = Date.now().toString();
            // Basic validation
            if (!tool.name || !tool.websiteUrl || !tool.shortDescription) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const insert = db.prepare(`
                INSERT INTO tools (id, name, shortDescription, description, category, rating, reviewCount, pricing, imageUrl, tags, websiteUrl, featured, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            // Default values for submitted tools
            const rating = 0;
            const reviewCount = 0;
            const featured = 0;
            const status = 'pending';
            const imageUrl = `https://picsum.photos/seed/${id}/400/300`; // Placeholder image
            const tags = JSON.stringify([]);

            insert.run(id, tool.name, tool.shortDescription, tool.description || '', tool.category, rating, reviewCount, 'Free', imageUrl, tags, tool.websiteUrl, featured, status);
            
            res.status(201).json({ message: 'Tool submitted successfully for review', id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/auth/verify', (req, res) => {
        const { key } = req.body;
        if (key === ADMIN_KEY) {
            res.json({ valid: true });
        } else {
            res.status(401).json({ valid: false });
        }
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        // Serve static files in production
        app.use(express.static(path.join(__dirname, 'dist')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'dist', 'index.html'));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
