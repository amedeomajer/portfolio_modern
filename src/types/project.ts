export interface Project {
	name: string;
	image: string;
	imageAlt: string;
	placeholderDescription: string;
	longDescription: {
		intro: string;
		contributions: { title: string; description: string }[];
		impact: string;
	};
	tech: string[];
	url: string | null;
}
