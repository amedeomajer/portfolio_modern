import Card from "./Card";
import CardDescription from "./CardDescription";
import CardImage from "./CardImage";
import { DrawerTrigger } from "./Drawer";

interface ProjectCardProps {
  project: {
    name: string;
    image: string;
    imageAlt: string;
    placeholderDescription: string;
  };
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <DrawerTrigger className="px-2">
      <Card
        layoutId={project.name}
        onClick={onClick}
        className="cursor-pointer"
      >
        <CardImage
          image={`/images/${project.image}`}
          imageAlt={project.imageAlt}
        />
        <CardDescription>
          <strong>{project.name}</strong>
          {project.placeholderDescription}
        </CardDescription>
      </Card>
    </DrawerTrigger>
  );
};

export default ProjectCard;
