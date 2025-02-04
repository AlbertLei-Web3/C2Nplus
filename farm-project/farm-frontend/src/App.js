import React from 'react';
import {
  ChakraProvider,
  Box,
  Container,
} from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './contexts/Web3Context';
import Navbar from './components/Navigation/Navbar';
import Home from './pages/Home';
import Farm from './pages/Farm';
import Projects from './pages/Projects';
import Staking from './pages/Staking';
import AIAssistant from './pages/AIAssistant';

function App() {
  return (
    <ChakraProvider>
      <Web3Provider>
        <Router>
          <Box>
            <Navbar />
            <Container maxW="container.xl" py={8}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/farm" element={<Farm />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/staking" element={<Staking />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </Web3Provider>
    </ChakraProvider>
  );
}

export default App;