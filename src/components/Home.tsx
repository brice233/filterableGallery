import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import Button from "./Button";
import { Image } from "./Image";
import { Text } from "./Text";
import UploadImageDialog from "./UploadImageDialog";
import UpdateDeleteModule from "./UpdateDeleteModule";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

export interface Pest {
  _id: string;
  name: string;
  description: string;
  text: string;
  imageUrl: string;
  category: "negative" | "positive" | "neutral";
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TruncatedText = ({ text = "", maxLength = 100, pestId }) => {
  const navigate = useNavigate();

  if (text.length <= maxLength) {
    return (
      <Text as="p" className="mb-3 font-normal text-gray-400">
        {text}
      </Text>
    );
  }

  return (
    <div className="mb-3 font-normal text-gray-400">
      <Text as="p" className="line-clamp-3">
        {text}
      </Text>
      <button
        onClick={() => navigate(`/pests/${pestId}`)}
        className="mt-1 text-blue-500 hover:text-blue-600 focus:outline-none"
      >
        Read more
      </button>
    </div>
  );
};

const Home = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const {
    data: pests,
    error,
    mutate,
  } = useSWR<Pest[]>("http://localhost:8080/api/v1/pest", fetcher);
  const [selectedPest, setSelectedPest] = useState<Pest | null>(null);
  const [isUpdateDeleteOpen, setIsUpdateDeleteOpen] = useState(false);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleUpdate = (pest: Pest) => {
    setSelectedPest(pest);
    setIsUpdateDeleteOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this pest?")) {
      try {
        await fetch(`http://localhost:8080/api/v1/pest/${id}`, {
          method: "DELETE",
        });
        mutate();
      } catch (error) {
        console.error("Error deleting pest:", error);
      }
    }
  };

  const filteredPests =
    activeFilter === "all"
      ? pests
      : pests?.filter((pest) => pest.category === activeFilter);

  if (error) return <div>Failed to load</div>;
  if (!pests) return <div>Loading...</div>;

  return (
    <section className="w-full flex flex-col gap-12 py-16 lg:px-16 md:px-10 px-5">
      <div className="flex w-full md:justify-center items-start md:gap-6 gap-3 flex-wrap">
        {["all", "negative", "positive", "neutral"].map((filter) => (
          <Button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            type="button"
            className={`focus:outline-none border-2 border-purple-600 hover:bg-purple-700 font-medium rounded-lg text-sm px-5 text-white py-2.5 mb-2 capitalize ${
              activeFilter === filter ? "bg-purple-600" : " "
            }`}
          >
            {filter === "all" ? "Show all" : filter}
          </Button>
        ))}

        <UploadImageDialog onUploadSuccess={() => mutate()} />
      </div>

      <main className="w-full grid lg:grid-cols-4 md:grid-cols-2 gap-x-5 gap-y-8 md:mt-8">
        {filteredPests?.map((pest) => (
          <div
            key={pest._id}
            className="w-full transition-all duration-200 rounded-lg shadow bg-gray-800 border border-gray-600 flex flex-col h-full"
          >
            <Image
              className="rounded-t-lg w-full h-[200px] overflow-hidden"
              image={pest.imageUrl}
              alt={pest.name}
              objectCover="object-cover"
            />
            <div className="p-5 flex flex-col flex-grow">
              <Text
                as="h5"
                className="mb-2 text-2xl font-bold tracking-tight text-white"
              >
                {pest.name}
              </Text>
              <div className="flex-grow">
                <TruncatedText
                  text={pest.description}
                  maxLength={100}
                  pestId={pest._id}
                />
              </div>
              <div className="flex justify-end mt-2">
                <IconButton onClick={() => handleUpdate(pest)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(pest._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </div>
        ))}
      </main>

      <UpdateDeleteModule
        isOpen={isUpdateDeleteOpen}
        onClose={() => setIsUpdateDeleteOpen(false)}
        pest={selectedPest}
        onUpdateSuccess={() => {
          mutate();
          setIsUpdateDeleteOpen(false);
        }}
      />
    </section>
  );
};

export default Home;
