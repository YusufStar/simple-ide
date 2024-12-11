"use client";
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import modeJava from "ace-builds/src-noconflict/mode-java";
import modeJavascript from "ace-builds/src-noconflict/mode-javascript";
import modePython from "ace-builds/src-noconflict/mode-python";
import githubTheme from "ace-builds/src-noconflict/theme-one_dark";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { config } from "ace-builds";
import { LoadingButton } from "@/components/ui/loading-button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

config.setModuleUrl("ace/mode/java", modeJava);
config.setModuleUrl("ace/mode/javascript", modeJavascript);
config.setModuleUrl("ace/mode/python", modePython);
config.setModuleUrl("ace/theme/one_dark", githubTheme);

type Props = {};

const exampleProjects = {
    "fibonacci": {
        java: `public class Main {
        public static long fibonacci(int n) {
            if (n <= 1) return n;
            return fibonacci(n - 1) + fibonacci(n - 2);
        }
    
        public static void main(String[] args) {
            long start = System.currentTimeMillis();
            long result = fibonacci(40); // Ağır bir işlem
            long end = System.currentTimeMillis();
    
            System.out.println("Fibonacci sonucu: " + result);
            System.out.println("Hesaplama süresi: " + (end - start) / 1000.0 + " saniye");
        }
    }`,
        python: `import time
    
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

start = time.time()
result = fibonacci(40)  # Ağır bir işlem
end = time.time()

print("Fibonacci sonucu:", result)
print("Hesaplama süresi:", end - start, "saniye")`,
    javascript: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const start = Date.now();
const result = fibonacci(40); // Ağır bir işlem
const end = Date.now();

console.log("Fibonacci sonucu:", result);
console.log("Hesaplama süresi:", (end - start) / 1000, "saniye");`,
    },
    "factorial": {
        java: `public class Main {
        public static long factorial(int n) {
            if (n <= 1) return 1;
            return n * factorial(n - 1);
        }
    
        public static void main(String[] args) {
            System.out.println("5! = " + factorial(5));
        }
    }`,
        python: `
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
    
print("5! =", factorial(5))`,
        javascript: `function factorial(n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
    
    console.log("5! =", factorial(5));`,
    },
    "prime-check": {
        java: `public class Main {
        public static boolean isPrime(int n) {
            if (n <= 1) return false;
            for (int i = 2; i <= Math.sqrt(n); i++) {
                if (n % i == 0) return false;
            }
            return true;
        }
    
        public static void main(String[] args) {
            System.out.println("7 is prime: " + isPrime(7));
        }
    }`,
        python: `def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

print("7 is prime:", is_prime(7))
`,
        javascript: `function isPrime(n) {
        if (n <= 1) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }
    
    console.log("7 is prime:", isPrime(7));`,
    },
    "hello-world": {
        java: `public class Main {
        public static void main(String[] args) {
            System.out.println("Hello, World!");
        }
    }`,
        python: `print("Hello, World!")`,
        javascript: `console.log("Hello, World!");`,
    },
} as any

const CodeEditor = (props: Props) => {
    const [code, setCode] = useState<string>(""); // State for the code value
    const [mode, setMode] = useState("python"); // State for the editor mode (language)
    const [exampleCode, setexampleCode] = useState("fibonacci")
    const [consoleOutput, setConsoleOutput] = useState(""); // State for console output
    const [loading, setLoading] = useState(false); // State for loading animation

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
    };

    useEffect(() => {
        setCode(exampleProjects[exampleCode][mode]);
    }, [mode, exampleCode])

    const testCodeExecution = async () => {
        setLoading(true); // Show loading animation
        setConsoleOutput(""); // Clear previous output

        const url = 'http://localhost:3000/api/run'; // Express API endpoint

        const requestBody = {
            language: mode, // Set selected language dynamically
            code: code, // Send current code
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            setConsoleOutput(data.output); // Set console output after successful execution
        } catch (error) {
            //@ts-ignore
            setConsoleOutput(`Error: ${error.message}`); // Display error if occurs
        } finally {
            setLoading(false); // Hide loading animation after execution
        }
    };

    return (
        <div className="flex w-full">
            <div className="flex flex-col w-full h-full">
                <div className="py-2 px-6 w-full flex items-center">
                    <h1 className="text-xl font-semibold text-white ml-4">Code Editor</h1>

                    <Select value={exampleCode} onValueChange={(val) => setexampleCode(val)}>
                        <SelectTrigger className="w-[125px] ml-auto">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fibonacci">Fibonacci</SelectItem>
                            <SelectItem value="factorial">Factorial</SelectItem>
                            <SelectItem value="prime-check">Prime Check</SelectItem>
                            <SelectItem value="hello-world">Hello World</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={mode} onValueChange={(val) => setMode(val)}>
                        <SelectTrigger className="w-[125px] ml-1">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="javascript">Javascript</SelectItem>
                            <SelectItem value="python">Python 3</SelectItem>
                        </SelectContent>
                    </Select>

                    <LoadingButton
                        className="ml-1"
                        variant={"outline"}
                        loading={loading}
                        onClick={testCodeExecution}
                    >
                        Run Code
                    </LoadingButton>
                </div>
                <AceEditor
                    style={{ width: "100%", height: "100%" }}
                    placeholder="Type your code here"
                    mode={mode}
                    theme="one_dark"
                    name="code-editor"
                    onChange={handleCodeChange}
                    fontSize={12}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={code}
                    wrapEnabled={true}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true,
                    }}
                />
            </div>
            <SyntaxHighlighter
                language="powershell"
                style={atomOneDark}
                customStyle={{
                    width: "50%",
                    height: "100%",
                    padding: "10px",
                    fontSize: 12,
                    overflowY: "auto",
                }}
                wrapLongLines={true}
            >
                {loading ? "Running code..." : consoleOutput || "No output yet"}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeEditor;
