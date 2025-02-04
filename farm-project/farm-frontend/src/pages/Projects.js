import React from 'react';
import { VStack } from '@chakra-ui/react';
import ProjectCard from '../components/Farm/ProjectCard'; // 确保你有这个组件

function Projects() {
    return (
      <VStack spacing={6}>
        <ProjectCard />
        <ProjectCard />
        {/* 更多项目卡片 */}
      </VStack>
    );
}

export default Projects;