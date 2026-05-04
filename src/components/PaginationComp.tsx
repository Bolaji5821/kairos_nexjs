import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/Pagination";

type PaginationData = {
  total: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  nextPageUrl: string | null;
  hasPrevious: boolean;
  prevPageUrl: string | null;
};

type Props = {
  pagination: PaginationData;
  handlePageChange: (newPage: number) => void;
};

export const PaginationComponent = ({
  pagination,
  handlePageChange,
}: Props) => {
  return (
    <section className="">
      <Pagination className="py-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(pagination?.pageNo - 1)}
              aria-disabled={!pagination?.hasPrevious}
              tabIndex={!pagination?.hasPrevious ? -1 : 0}
              className={cn(
                "cursor-pointer",
                !pagination?.hasPrevious && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>

          {/* Render all pages without ellipses if totalPages is 5 or fewer */}
          {pagination?.totalPages <= 5 ? (
            [...Array(pagination?.totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  isActive={index + 1 === pagination?.pageNo}
                  onClick={() => handlePageChange(index + 1)}
                  className="flex cursor-pointer"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))
          ) : (
            <>
              {/* First page */}
              <PaginationItem>
                <PaginationLink
                  isActive={pagination?.pageNo === 1}
                  onClick={() => handlePageChange(1)}
                  className="flex cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Ellipsis before current range if necessary */}
              {pagination?.pageNo > 3 && (
                <PaginationItem>
                  <PaginationEllipsis className="flex" />
                </PaginationItem>
              )}

              {/* Pages around current page */}
              {[...Array(pagination?.totalPages)]
                .map((_, index) => index + 1)
                .filter(
                  (page) =>
                    page !== 1 &&
                    page !== pagination?.totalPages &&
                    page >= pagination?.pageNo - 1 &&
                    page <= pagination?.pageNo + 1,
                )
                .map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === pagination?.pageNo}
                      onClick={() => handlePageChange(page)}
                      className="flex cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {/* Ellipsis after current range if necessary */}
              {pagination?.pageNo < pagination?.totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis className="flex" />
                </PaginationItem>
              )}

              {/* Last page */}
              <PaginationItem>
                <PaginationLink
                  isActive={pagination?.pageNo === pagination?.totalPages}
                  onClick={() => handlePageChange(pagination?.totalPages)}
                  className="flex cursor-pointer"
                >
                  {pagination?.totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(pagination?.pageNo + 1)}
              aria-disabled={!pagination?.hasNext}
              tabIndex={!pagination?.hasNext ? -1 : 0}
              className={cn(
                "cursor-pointer",
                !pagination?.hasNext && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};
