import { Request, Response } from 'express';
import { exec } from 'child_process';
import fs from 'fs';  // fs.promises yerine fs kullanıyoruz
import path from 'path';
import os from 'os';

const runCode = async (req: Request, res: Response) => {
    const { language, code } = req.body;

    // Desteklenen diller
    if (!['python', 'javascript', 'java'].includes(language)) {
        return res.status(400).json({ message: 'Unsupported language' });
    }

    try {
        // Geçici dosya oluşturulacak dizin
        const tempDir = os.tmpdir();

        // Dosya ismini dil türüne göre belirle
        const fileName = language === 'python' ? 'code.py' : language === 'javascript' ? 'code.js' : 'Main.java';
        const filePath = path.join(tempDir, fileName);

        // Kod içeriğini geçici dosyaya yaz
        await fs.promises.writeFile(filePath, code);

        // Docker komutunu oluştur
        const dockerCommand =
            language === 'python'
                ? `docker run --rm -v ${filePath}:/usr/src/app/code.py code-runner-python`
                : language === 'javascript'
                    ? `docker run --rm -v ${filePath}:/usr/src/app/code.js code-runner-node`
                    : `docker run --rm -v ${filePath}:/usr/src/app/Main.java code-runner-java`;

        // Docker komutunu çalıştır
        exec(dockerCommand, (error, stdout, stderr) => {
            if (error) {
                return res.status(400).json({ output: stderr || error.message });
            }

            // Eğer çıktı görseli varsa, onu gönder
            const outputFile = path.join(tempDir, 'output.png');
            if (fs.existsSync(outputFile)) {
                return res.sendFile(outputFile);
            }

            return res.status(200).json({ output: stdout });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
};

export default runCode;
