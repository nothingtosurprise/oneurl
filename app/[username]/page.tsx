import { notFound } from "next/navigation";
import { Link2, BadgeCheck } from "lucide-react";
import { profileService } from "@/lib/services/profile.service";
import type { Metadata } from "next";
import Image from "next/image";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import LinkClickTracker from "./link-click-tracker";
import { getAvatarUrl } from "@/lib/utils";
import { ProfileCardHeader } from "@/components/profile-card-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaperTextureBackground } from "@/components/halftonedots-texture-background";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await profileService.getByUsername(username);

  if (!user || !user.profile?.isPublished) {
    return {
      title: "Profile Not Found",
    };
  }

  const avatarUrl = getAvatarUrl(user);
  const profileUrl = `https://oneurl.live/${username}`;
  const images = avatarUrl 
    ? [{ url: avatarUrl, width: 400, height: 400, alt: `${user.name}'s profile picture` }]
    : [{ url: "/og.png", width: 1200, height: 630, alt: "OneURL" }];

  return {
    title: `${user.name} | OneURL`,
    description: user.bio || `Visit ${user.name}'s profile on OneURL`,
    metadataBase: new URL("https://oneurl.live"),
    openGraph: {
      title: `${user.name} | OneURL`,
      description: user.bio || `Visit ${user.name}'s profile on OneURL`,
      url: profileUrl,
      siteName: "OneURL",
      images,
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name} | OneURL`,
      description: user.bio || `Visit ${user.name}'s profile on OneURL`,
      images: images.map(img => img.url),
    },
    alternates: {
      canonical: profileUrl,
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const user = await profileService.getByUsername(username);

  if (!user || !user.profile?.isPublished) {
    notFound();
  }

  const links = user.profile.links.filter((link) => link.isActive);

  const avatarUrl = getAvatarUrl(user);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center sm:py-16 sm:px-4">
      {/* Background - hidden on mobile as per "show only the card" */}
      <div className="hidden sm:block">
        <PaperTextureBackground />
      </div>
      
      {/* Mobile background is just white/default to ensure card looks seamless */}
      <div className="sm:hidden absolute inset-0 bg-card -z-10" />

      {/* Card Container */}
      <div className="relative z-10 w-full sm:max-w-[500px] bg-card sm:rounded-[2.5rem] sm:shadow-2xl flex flex-col min-h-screen sm:min-h-[80vh] overflow-hidden border-0 sm:border ring-1 ring-black/5">
        <div className="flex flex-col p-6 sm:p-10 pt-8 flex-1 min-h-[inherit]">
          <ProfileCardHeader
            name={user.name}
            username={user.username}
            avatarUrl={avatarUrl}
          />

          <div className="flex flex-col items-center space-y-4 mb-8 mt-2">
            {avatarUrl && (
              <div className="relative">
                <Image
                  src={avatarUrl}
                  alt={user.name}
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-full border-4 border-background shadow-sm object-cover"
                  priority
                />
              </div>
            )}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{user.name}</h1>
                <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 shrink-0" />
              </div>
              {user.username && (
                <p className="text-sm font-medium text-muted-foreground">@{user.username}</p>
              )}
            </div>
          </div>

          {user.bio && (
            <div className="mb-10 text-center px-4">
              <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-line text-muted-foreground/90">{user.bio}</p>
            </div>
          )}

          <div className="flex-1 w-full flex flex-col">
            {links.length > 0 ? (
              <div className="space-y-4 w-full">
                {links.map((link) => (
                  <LinkClickTracker key={link.id} linkId={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block w-full rounded-[2rem] border bg-background p-4 px-6 text-center font-medium transition-all hover:bg-accent hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                    >
                      <span className="line-clamp-1">{link.title}</span>
                    </a>
                  </LinkClickTracker>
                ))}
              </div>
            ) : (
              <div className="py-8 flex-1 flex items-center justify-center">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Link2 className="h-10 w-10 text-muted-foreground/50" />
                    </EmptyMedia>
                    <EmptyTitle>No links yet</EmptyTitle>
                    <EmptyDescription>
                      Check back later for updates.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </div>
            )}
          </div>

          <div className="mt-auto pt-12 flex flex-col items-center gap-6">
            <Link href="/signup">
              <Button
                variant="secondary"
                className="rounded-full px-8 h-12 font-medium shadow-sm hover:shadow transition-all bg-secondary/50 hover:bg-secondary/80"
              >
                Join {user.username || "OneURL"} on OneURL
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
